import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Document } from "./Document";

@Entity()
export class Service {
  @PrimaryColumn()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.service)
  user: User[];

  @ManyToMany(() => Document, document => document.services)
  documents: Document[];
}
