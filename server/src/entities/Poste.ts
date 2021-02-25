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
export class Poste {
  @PrimaryColumn()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.poste)
  user: User[];

  @ManyToMany(() => Document, document => document.postes)
  documents: Document[];
}
