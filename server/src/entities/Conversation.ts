import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConvToUser } from "./ConvToUser";
import { Message } from "./Message";


@ObjectType()
@Entity()
export class Conversation extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => [ConvToUser])
  @OneToMany((type) => ConvToUser, (convToUser) => convToUser.conversation, {
    cascade: false,
  })
  convToUsers!: ConvToUser[];

  @Field((type) => [Message])
  @OneToMany(() => Message, (message) => message.conversation, {
    nullable: true,
    cascade: false,
  })
  messages: Message[];
}
