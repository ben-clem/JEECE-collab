import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { getConnection } from "typeorm";

@InputType()
class RegisterInput {
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
}

@Resolver()
export class UserResolver {

  @Mutation(() => User)
  async register(
    @Arg("input") { email, password, firstname, lastname }: RegisterInput
  ): Promise<User> {
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
      return (user = result.raw[0]);
    } catch (err) {
      return err;
    }
  }

  
  
}
