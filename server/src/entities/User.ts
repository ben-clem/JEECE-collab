import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConvToUser } from "./ConvToUser";
import { Poste } from "./Poste";
import { Service } from "./Service";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  email!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  firstname!: string;

  @Field()
  @Column()
  lastname!: string;

  @Field()
  @Column({ default: false })
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

  @ManyToOne(() => Service, (service) => service.users, {
    nullable: true,
    cascade: ["update", "soft-remove", "insert"],
  })
  service: Service;

  @ManyToOne(() => Poste, (poste) => poste.users, {
    nullable: true,
    cascade: ["update", "soft-remove", "insert"],
  })
  poste: Poste;

  @OneToMany(() => ConvToUser, (convToUser) => convToUser.user, {
    cascade: false,
  })
  convToUsers!: ConvToUser[];
}
