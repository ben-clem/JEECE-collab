import { Message } from "../entities/Message";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { Conversation } from "../entities/Conversation";
import { ConvToUser } from "../entities/ConvToUser";
import { ConvResponse, ConvsResponse } from "./objectTypes";

@Resolver()
export class MessageResolver {
  @Mutation(() => Message)
  async addMessage(
    @Arg("message", (type) => String) message: string,
    @Arg("convUuid", (type) => String) convUuid: string,
    @Arg("userId", (type) => Int) userId: number
  ): Promise<Message> {
    try {
      // create the new message
      const newMessage = await Message.create({
        content: message,
        userId,
        conversationUuid: convUuid,
      }).save();

      return await getConnection()
        .getRepository(Message)
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.user", "user")
        .leftJoinAndSelect("user.service", "service")
        .leftJoinAndSelect("user.poste", "poste")
        .where("message.conversationUuid = :convUuid", { convUuid })
        .andWhere("message.uuid = :uuid", { uuid: newMessage.uuid })
        .getOneOrFail();
    } catch (err) {
      return err;
    }
  }

  @Query(() => [Message])
  async messages(
    @Arg("convUuid", (type) => String) convUuid: string
  ): Promise<Message[]> {
    try {
      return await getConnection()
        .getRepository(Message)
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.user", "user")
        .leftJoinAndSelect("user.service", "service")
        .leftJoinAndSelect("user.poste", "poste")
        .where("message.conversationUuid = :convUuid", { convUuid })
        .getMany();
    } catch (err) {
      return err;
    }
  }
}
