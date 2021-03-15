import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Poste } from "./Poste";
import { Service } from "./Service";

@ObjectType()
@Entity()
export class Document extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  filePath: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Poste, (poste) => poste.documents, {
    nullable: true,
    cascade: true
  })
  @JoinTable()
  postes: Poste[];

  @ManyToMany(() => Service, (service) => service.documents, {
    nullable: true,
    cascade: true
  })
  @JoinTable()
  services: Service[];
}
