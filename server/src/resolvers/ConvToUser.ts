import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { ConvToUser } from "../entities/ConvToUser";

@Resolver()
export class ConvToUserResolver {
  @Query(() => [ConvToUser])
  convToUsers(): Promise<ConvToUser[]> {
    return ConvToUser.find();
  }

  // @Query(() => ConvToUser, { nullable: true })
  // convToUserByName(@Arg("name") name: string): Promise<ConvToUser | undefined> {
  //   return ConvToUser.findOne({ name });
  // }

  // @Query(() => ConvToUser, { nullable: true })
  // convToUserById(
  //   @Arg("id", (type) => Int) id: number
  // ): Promise<ConvToUser | undefined> {
  //   return ConvToUser.findOne({ id });
  // }

  // @Mutation(() => ConvToUser)
  // async createConvToUser(@Arg("name") name: string): Promise<ConvToUser> {
  //   return ConvToUser.create({ name }).save();
  // }

  // @Mutation(() => ConvToUser)
  // async updateConvToUser(
  //   @Arg("id", (type) => Int) id: number,
  //   @Arg("newName") newName: string
  // ): Promise<ConvToUser | null> {
  //   const convToUser = await ConvToUser.findOne({ id });
  //   if (!convToUser) {
  //     return null;
  //   } else if (typeof newName !== "undefined") {
  //     convToUser.name = newName;
  //     convToUser.updatedAt = new Date();
  //     await ConvToUser.update(id, convToUser);
  //   }
  //   return convToUser;
  // }

  // @Mutation(() => Boolean)
  // async deleteConvToUser(
  //   @Arg("id", (type) => Int, { nullable: true }) id: string
  // ): Promise<boolean> {
  //   try {
  //     await ConvToUser.delete(id);
  //   } catch {
  //     return false;
  //   }
  //   return true;
  // }
}
