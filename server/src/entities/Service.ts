import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Document } from "./Document";
import { User } from "./User";

@ObjectType()
@Entity()
export class Service extends BaseEntity {
  @Field()
  @PrimaryColumn()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.service, {
    nullable: true,
    cascade: false,
  })
  user: User[];

  @ManyToMany(() => Document, (document) => document.services, {
    nullable: true,
    cascade: false,
  })
  documents: Document[];
}
