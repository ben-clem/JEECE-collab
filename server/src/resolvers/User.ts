import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { __secret__ } from "../constants";
import { decodedToken } from "../decodedToken";
import { User } from "../entities/User";
import { MyContext } from "../types";
import { validateRegister } from "../utils/validateRegister";
import { FieldError, UserResponse } from "./objectTypes";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string
  ): Promise<UserResponse> {
    let errors = validateRegister(email, password);

    let user;
    let userToken;
    if (errors.length === 0) {
      // hashing the password w/ argon2 to prevent crack in case of hacking
      const hashedPassword = await argon2.hash(password);
      // creating the user w/ the QueryBuilder to take full advantage of TypeORM entities description power
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

        userToken = jwt.sign(
          {
            email: user.email,
            accepted: user.accepted,
            admin: user.admin,
          },
          __secret__
        );
      } catch (err) {
        if (err.code === "23505") {
          errors.push({
            field: "email",
            message: "an account with this email already exists",
          });
        }
      }
    }

    return { errors, user, token: userToken };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    let errors: FieldError[] = [];
    let user;
    let userToken;

    if (!email.includes("@")) {
      errors.push({
        field: "email",
        message: "invalid email",
      });
    }

    if (errors.length === 0) {
      user = await getConnection()
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.email = :email", { email })
        .getOne();

      if (!user) {
        errors.push({
          field: "email",
          message: "that email doesn't exist",
        });
      } else {
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
          errors.push({
            field: "password",
            message: "incorrect password",
          });
        } else {
          userToken = jwt.sign(
            {
              email: user.email,
              accepted: user.accepted,
              admin: user.admin,
            },
            __secret__
          );

          return { errors, user, token: userToken };
        }
      }
    }

    return { errors };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    const decoded = JSON.parse(JSON.stringify(decodedToken(req)));

    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", { email: decoded.email })
      .getOne();

    return user;
  }
}
