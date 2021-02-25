import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Poste } from "./poste";
import { Service } from "./service";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("bytea")
  file: object;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Poste, (poste) => poste.documents)
  @JoinTable()
  postes: Poste[];

  @ManyToMany(() => Service, (service) => service.documents)
  @JoinTable()
  services: Service[];
}
