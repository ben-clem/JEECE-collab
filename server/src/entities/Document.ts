import {
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

  @ManyToMany(() => Poste, (poste) => poste.documents, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  @JoinTable()
  postes: Poste[];

  @ManyToMany(() => Service, (service) => service.documents, {
    nullable: true,
    cascade: ["update", "soft-remove"],
  })
  @JoinTable()
  services: Service[];
}
