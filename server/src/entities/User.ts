import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConvToUser } from "./ConvToUser";
import { Message } from "./Message";
import { Poste } from "./Poste";
import { Service } from "./Service";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Field()
  @Column({ unique: true, nullable: false })
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, default: null })
  accepted!: boolean;

  @Field()
  @Column({ default: false })
  admin!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePicPath: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field((type) => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  serviceId: number;

  @Field((type) => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  posteId: number;

  @Field((type) => Service)
  @ManyToOne(() => Service, (service) => service.users, {
    nullable: true,
    cascade: ["update", "soft-remove", "insert"],
  })
  service: Service;

  @Field((type) => Poste)
  @ManyToOne(() => Poste, (poste) => poste.users, {
    nullable: true,
    cascade: ["update", "soft-remove", "insert"],
  })
  poste: Poste;

  @OneToMany(() => ConvToUser, (convToUser) => convToUser.user, {
    cascade: false,
  })
  convToUsers!: ConvToUser[];

  @OneToMany(() => Message, (message) => message.user, {
    cascade: false,
  })
  messages: Message[];
}
