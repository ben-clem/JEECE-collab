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

  @Column({ default: false })
  public active!: boolean;

  @ManyToOne(() => Conversation, (conversation) => conversation.convToUsers)
  public conversation!: Conversation;

  @ManyToOne(() => User, (user) => user.convToUsers)
  public user!: User;
}
