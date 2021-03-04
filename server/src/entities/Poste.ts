import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";

@ObjectType()
@Entity()
export class Poste extends BaseEntity {
  @Field((type) => Int)
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.poste, {
    nullable: true,
    cascade: false,
  })
  users: User[];

  @ManyToMany(() => Document, (document) => document.postes, {
    nullable: true,
    cascade: false,
  })
  documents: Document[];
}
