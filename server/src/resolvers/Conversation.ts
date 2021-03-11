import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { ConvToUser } from "../entities/ConvToUser";
import { ConvResponse, ConvsResponse } from "./objectTypes";

@Resolver()
export class ConversationResolver {
  @Query(() => [Conversation])
  conversations(): Promise<Conversation[]> {
    return getRepository(Conversation)
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.convToUsers", "convToUser")
      .getMany();
  }

  @Query(() => ConvResponse)
  async conversationByUuid(@Arg("uuid") uuid: string): Promise<ConvResponse> {
    try {
      const conv = await getRepository(Conversation)
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.convToUsers", "convToUser")
        .where("conversation.uuid = :uuid", { uuid })
        .getOneOrFail();
      return { _id: uuid, conv };
    } catch (err) {
      return { _id: uuid, error: err.toString() };
    }
  }

  @Query(() => ConvsResponse)
  async conversationsByUserId(
    @Arg("id", (type) => Int) id: number
  ): Promise<ConvsResponse> {
    try {
      const allConvos = await getRepository(Conversation)
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.convToUsers", "convToUser")
        .getMany();

      const userConvos = allConvos.filter((conv) => {
        if (
          conv.convToUsers[0].userId === id ||
          conv.convToUsers[1].userId === id
        ) {
          return true;
        } else {
          return false;
        }
      });

      return { convs: userConvos };
    } catch (err) {
      return { error: err.toString() };
    }
  }

  @Query(() => ConvResponse)
  async conversationWithUserIds(
    @Arg("id1", (type) => Int) id1: number,
    @Arg("id2", (type) => Int) id2: number
  ): Promise<ConvResponse> {
    try {
      // check if that conversation already exists
      const conversations = await getRepository(Conversation)
        .createQueryBuilder("conversation")
        .leftJoinAndSelect("conversation.convToUsers", "convToUser")
        .getMany();

      let exists: boolean = false;
      let found: Conversation = new Conversation();

      for (const conv of conversations) {
        if (
          (conv.convToUsers[0].userId === id1 &&
            conv.convToUsers[1].userId === id2) ||
          (conv.convToUsers[0].userId === id2 &&
            conv.convToUsers[1].userId === id1)
        ) {
          exists = true;
          found = conv;
          break;
        }
      }

      if (exists) {
        return { _id: id1.toString() + "-" + id2.toString(), conv: found };
      } else {
        return { _id: id1.toString() + "-" + id2.toString(), conv: undefined };
      }
    } catch (err) {
      return {
        _id: id1.toString() + "-" + id2.toString(),
        error: err.toString(),
      };
    }
  }

  @Mutation(() => ConvResponse)
  async createConversationWithUserIds(
    @Arg("id1", (type) => Int) id1: number,
    @Arg("id2", (type) => Int) id2: number
  ): Promise<ConvResponse> {
    // check if that conversation already exists
    const conversations = await getRepository(Conversation)
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.convToUsers", "convToUser")
      .getMany();

    let exists: boolean = false;

    for (const conv of conversations) {
      if (
        (conv.convToUsers[0].userId === id1 &&
          conv.convToUsers[1].userId === id2) ||
        (conv.convToUsers[0].userId === id2 &&
          conv.convToUsers[1].userId === id1)
      ) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      // create the conversation
      try {
        const newConv = Conversation.create({});
        await Conversation.save(newConv);

        const convToUser1 = ConvToUser.create({
          userId: id1,
          conversationUuid: newConv.uuid,
        });
        await ConvToUser.save(convToUser1);

        const convToUser2 = ConvToUser.create({
          userId: id2,
          conversationUuid: newConv.uuid,
        });
        await ConvToUser.save(convToUser2);

        // get the newly created conv with its convToUser array field
        const conv = await getRepository(Conversation)
          .createQueryBuilder("conversation")
          .leftJoinAndSelect("conversation.convToUsers", "convToUser")
          .where("conversation.uuid = :uuid", { uuid: newConv.uuid })
          .getOneOrFail();

        return { _id: id1.toString() + "-" + id2.toString(), conv };
      } catch (err) {
        if (err.code === "23503") {
          return {
            _id: id1.toString() + "-" + id2.toString(),
            error: "one of the provided user ids is not valid",
          };
        } else {
          return {
            _id: id1.toString() + "-" + id2.toString(),
            error: err.toString(),
          };
        }
      }
    } else {
      return {
        _id: id1.toString() + "-" + id2.toString(),
        error: "this conversation already exists",
      };
    }
  }
}
