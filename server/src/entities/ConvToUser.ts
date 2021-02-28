import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class ConvToUser {
  @PrimaryGeneratedColumn()
  public convToUserId!: number;

  @Column()
  public conversationUuid!: string;

  @Column()
  public userEmail!: string;

  @Column({ default: true })
  public active!: boolean;

  @ManyToOne(() => Conversation, (conversation) => conversation.convToUsers, {
    cascade: false,
  })
  public conversation!: Conversation;

  @ManyToOne(() => User, (user) => user.convToUsers, {
    cascade: false,
  })
  public user!: User;
}
