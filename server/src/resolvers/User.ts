import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection, getRepository } from "typeorm";
import { __prod__, __secret__ } from "../constants";
import { decodeToken } from "../decodedToken";
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
    @Arg("lastname") lastname: string,
    @Arg("serviceId", (type) => Int, { nullable: true }) serviceId: number,
    @Arg("posteId", (type) => Int, { nullable: true }) posteId: number,
    @Ctx() { res }: MyContext
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
            serviceId,
            posteId,
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

        // Set a cookie with the token
        res.cookie("userToken", userToken, {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          secure: __prod__, // https doesn't work in dev
          sameSite: "strict", // ? "lax"
          domain: __prod__ ? ".jeece-collab.fr" : undefined,
        });
      } catch (err) {
        if (err.code === "23505") {
          errors.push({
            field: "email",
            message: "an account with this email already exists",
          });
        }
      }
    }

    return { errors, user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
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
          // Set a cookie with the token
          res.cookie("userToken", userToken, {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            secure: __prod__, // https doesn't work in dev
            sameSite: "strict", // ? "lax"
            domain: __prod__ ? ".jeece-collab.fr" : undefined,
          });

          return { errors, user };
        }
      }
    }

    return { errors };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    const decoded = JSON.parse(JSON.stringify(decodeToken(req)));

    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", { email: decoded.email })
      .getOne();

    return user;
  }

  @Query(() => User, { nullable: true })
  async userById(
    @Arg("id", (type) => Int) id: number
  ): Promise<User | undefined> {
    try {
      const user = await getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.service", "service")
        .leftJoinAndSelect("user.poste", "poste")
        .where("user.id = :id", { id })
        .getOneOrFail();
      return user;
    } catch (err) {
      return err.toString();
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext) {
    return new Promise((resolve) => {
      res.clearCookie("userToken");
      resolve(true);
    });
  }

  @Query(() => [User], { nullable: true })
  async usersByFnOrLnOrSnOrPnLikeWordsInString(
    @Arg("string", (type) => String) string: string
  ): Promise<User[] | undefined> {
    const words = string.split(" ");
    let users: User[] = [];

    // for each word of the string (doesn't work with the "forEach" syntax, apparently "modern for" syntax is often a better choice)
    for (const word of words) {
      const fetchedUsers = await getConnection()
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.service", "service")
        .leftJoinAndSelect("user.poste", "poste")
        .where(
          "(LOWER(:word) = '') IS NOT TRUE AND LOWER(user.firstname) LIKE '%' || LOWER(:word) || '%'",
          { word }
        )
        .orWhere(
          "(LOWER(:word) = '') IS NOT TRUE AND LOWER(user.lastname) LIKE '%' || LOWER(:word) || '%'",
          { word }
        )
        .orWhere(
          "(LOWER(:word) = '') IS NOT TRUE AND LOWER(service.name) LIKE '%' || LOWER(:word) || '%'",
          { word }
        )
        .orWhere(
          "(LOWER(:word) = '') IS NOT TRUE AND LOWER(poste.name) LIKE '%' || LOWER(:word) || '%'",
          { word }
        )
        .getMany();

      // merging the new results in
      users = users.concat(fetchedUsers);
    }

    // removing duplicate entries based on id
    users = Array.from(new Set(users.map((u) => u.id))).map((id) => {
      return users.find((u) => u.id === id);
    }) as User[];

    return users;
  }

  @Query(() => [User], { nullable: true })
  async usersPending(): Promise<User[] | undefined> {
    return await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.service", "service")
      .leftJoinAndSelect("user.poste", "poste")
      .where("user.accepted IS NULL")
      .getMany();
  }

  @Mutation(() => User)
  async updateUserAccepted(
    @Arg("id", (type) => Int) id: number,
    @Arg("accepted") accepted: boolean
  ): Promise<User | null> {
    const user = await User.findOne({ id });
    if (!user) {
      return null;
    } else {
      user.accepted = accepted;
      user.updatedAt = new Date();
      await User.update(id, user);
    }
    return user;
  }
}
