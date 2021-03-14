import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { ConvToUser } from "../entities/ConvToUser";

@Resolver()
export class ConvToUserResolver {
  @Mutation(() => String)
  async updateConvToUser(
    @Arg("convUuid", (type) => String) convUuid: string,
    @Arg("userId", (type) => Int) userId: number,
    @Arg("active", (type) => Boolean) active: boolean
  ): Promise<string> {
    try {
      await getConnection()
        .createQueryBuilder()
        .update(ConvToUser)
        .set({ active })
        .where("conversationUuid = :convUuid", { convUuid })
        .andWhere("userId = :userId", { userId })
        .execute();

      return "good";
    } catch (err) {
      return err.toString();
    }
  }
}
