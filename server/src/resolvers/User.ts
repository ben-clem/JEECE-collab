import argon2 from "argon2";
import { validateRegister } from "../utils/validateRegister";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { User } from "../entities/User";
import { UserResponse } from "./objectTypes";
import jwt, { decode } from "jsonwebtoken";
import { __secret__ } from "../constants";
import { decodedToken } from "../decodedToken";
import { Request } from "express";
import { MyContext } from "../types";

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

    const userToken = jwt.sign(
      {
        email: user.email,
        accepted: user.accepted,
        admin: user.admin,
      },
      __secret__
    );
    return { user, token: userToken };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    if (!email.includes("@")) {
      return {
        errors: [
          {
            field: "email",
            message: "invalid email",
          },
        ],
      };
    }

    const user = await getConnection()
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .getOne();


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

    const userToken = jwt.sign(
      {
        email: user.email,
        accepted: user.accepted,
        admin: user.admin,
      },
      __secret__
    );
    return { user, token: userToken };
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
