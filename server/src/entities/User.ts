import { Field, ObjectType } from "type-graphql";
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

  @Field({nullable: true})
  @Column({nullable: true})
  profilePicPath: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({nullable: true})
  @ManyToOne(() => Service, (service) => service.user, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  service: string;

  @Field({nullable: true})
  @ManyToOne(() => Poste, (poste) => poste.user, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  poste: string;

  @OneToMany(() => ConvToUser, (convToUser) => convToUser.user, {
    cascade: false,
  })
  convToUsers!: ConvToUser[];
}
