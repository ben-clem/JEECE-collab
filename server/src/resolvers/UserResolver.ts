import argon2 from "argon2";
import { validateRegister } from "../utils/validateRegister";
import { Arg, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { UserResponse } from "./objectTypes";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<UserResponse> {
    const errors = validateRegister(email, password);
    if (errors) {
      return errors;
    }

    // hashing the password w/ argon2 to prevent crack in case of hacking
    const hashedPassword = await argon2.hash(password);
    // creating the user w/ the QueryBuilder to take full advantage of TypeORM entities description power
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          email,
          password: hashedPassword,
          firstname,
          lastname,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "an account with this email already exists",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "that email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    return { user };
  }
}
