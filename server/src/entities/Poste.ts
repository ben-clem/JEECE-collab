import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";

@ObjectType()
@Entity()
export class Poste extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

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
  user: User[];

  @ManyToMany(() => Document, (document) => document.postes, {
    nullable: true,
    cascade: false,
  })
  documents: Document[];
}
