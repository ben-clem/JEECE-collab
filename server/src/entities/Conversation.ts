import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConvToUser } from "./ConvToUser";
import { Message } from "./Message";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ConvToUser, (convToUser) => convToUser.conversation, {
    cascade: false,
  })
  public convToUsers!: ConvToUser[];

  @OneToMany(() => Message, (message) => message.conversation, {
    nullable: true,
    cascade: false,
  })
  public messages: Message[];
}
