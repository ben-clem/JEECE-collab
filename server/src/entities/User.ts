import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { ConvToUser } from "./ConvToUser";
import { Poste } from "./Poste";
import { Service } from "./Service";

@Entity()
export class User {
  @PrimaryColumn()
  email!: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @Column({ default: false })
  accepted: boolean;

  @Column("bytea", { nullable: true })
  profilePic: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Service, (service) => service.user, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  service: string;

  @ManyToOne(() => Poste, (poste) => poste.user, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  poste: string;

  @OneToMany(() => ConvToUser, (convToUser) => convToUser.user, {
    cascade: false,
  })
  public convToUsers!: ConvToUser[];
}
