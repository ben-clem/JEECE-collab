import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { ConvToUser } from "../entities/ConvToUser";

@Resolver()
export class ConversationResolver {
  
  @Query(() => [Conversation])
  conversations(): Promise<unknown[]> {
    return getRepository(Conversation)
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.convToUsers", "convToUser")
      .getMany();
  }

  @Query(() => Conversation, { nullable: true })
  conversationByTitle(
    @Arg("title") title: string
  ): Promise<Conversation | undefined> {
    return Conversation.findOne({ title });
  }

  @Query(() => Conversation, { nullable: true })
  conversationByUuid(
    @Arg("uuid") uuid: string
  ): Promise<Conversation | undefined> {
    return Conversation.findOne({ uuid });
  }

  @Mutation(() => Conversation)
  async createConversation(@Arg("title") title: string): Promise<Conversation> {
    return Conversation.create({ title }).save();
  }

  @Mutation(() => Conversation)
  async createConversationWithUserIds(
    @Arg("title") title: string,
    @Arg("userId1") userId1: number,
    @Arg("userId2") userId2: number
  ): Promise<Conversation> {
    // check if that conversation already exists

    // create the conversation
    const conversation = Conversation.create({
      title: title,
    });
    await Conversation.save(conversation);

    const convToUser1 = ConvToUser.create({
      userId: userId1,
      conversationUuid: conversation.uuid,
    });
    await ConvToUser.save(convToUser1);
    const convToUser2 = ConvToUser.create({
      userId: userId2,
      conversationUuid: conversation.uuid,
    });
    await ConvToUser.save(convToUser2);

    return conversation;
  }

  @Mutation(() => Conversation)
  async updateConversation(
    @Arg("uuid") uuid: string,
    @Arg("newTitle") newTitle: string
  ): Promise<Conversation | null> {
    const conversation = await Conversation.findOne({ uuid });
    if (!conversation) {
      return null;
    } else if (typeof newTitle !== "undefined") {
      conversation.title = newTitle;
      conversation.updatedAt = new Date();
      await Conversation.update(uuid, conversation);
    }
    return conversation;
  }

  @Mutation(() => Boolean)
  async deleteConversation(@Arg("uuid") uuid: string): Promise<boolean> {
    try {
      await Conversation.delete(uuid);
    } catch {
      return false;
    }
    return true;
  }
}
