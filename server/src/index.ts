import "reflect-metadata";
import { createConnection } from "typeorm";
import { Conversation } from "./entities/Conversation";
import { ConvToUser } from "./entities/ConvToUser";
import { Document } from "./entities/Document";
import { Message } from "./entities/Message";
import { Poste } from "./entities/poste";
import { Service } from "./entities/service";
import { User } from "./entities/User";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "JEECE-collab",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [
      Conversation,
      ConvToUser,
      Document,
      Message,
      Poste,
      Service,
      User,
    ],
  });
};

main().catch((err) => {
  console.error(err);
});
