import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Conversation } from "./entities/Conversation";
import { ConvToUser } from "./entities/ConvToUser";
import { Document } from "./entities/Document";
import { Message } from "./entities/Message";
import { Poste } from "./entities/Poste";
import { Service } from "./entities/Service";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { ServiceResolver } from "./resolvers/service";
import { getManager } from "typeorm";
import { PosteResolver } from "./resolvers/poste";

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
  const em = getManager();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, ServiceResolver, PosteResolver],
      validate: false,
    }),
    context: () => ({ em: em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
