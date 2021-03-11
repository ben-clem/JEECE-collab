import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => String)
  @Column({ type: "uuid" })
  conversationUuid: string;

  @Field((type) => Conversation)
  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    cascade: false,
  })
  conversation: Conversation;

  @Field()
  @Column()
  userId: number;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.messages, {
    cascade: false,
  })
  user: User;

}
