import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@ObjectType()
@Entity()
export class ConvToUser extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  convToUserId!: number;

  @Field()
  @Column({ default: true })
  active!: boolean;

  @Field()
  @Column("uuid")
  conversationUuid!: string;

  @Field()
  @Column()
  userId!: number;

  @ManyToOne(() => Conversation, (conversation) => conversation.convToUsers, {
    cascade: false,
  })
  conversation!: Conversation;

  @ManyToOne(() => User, (user) => user.convToUsers, {
    cascade: false,
  })
  user!: User;
}
