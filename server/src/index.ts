import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection, getManager } from "typeorm";
import { Conversation } from "./entities/Conversation";
import { ConvToUser } from "./entities/ConvToUser";
import { Document } from "./entities/Document";
import { Message } from "./entities/Message";
import { Poste } from "./entities/Poste";
import { Service } from "./entities/Service";
import { User } from "./entities/User";
import { ConversationResolver } from "./resolvers/Conversation";
import { ConvToUserResolver } from "./resolvers/ConvToUser";
import { HelloResolver } from "./resolvers/Hello";
import { MessageResolver } from "./resolvers/Message";
import { PosteResolver } from "./resolvers/Poste";
import { ServiceResolver } from "./resolvers/Service";
import { UserResolver } from "./resolvers/User";
import multer from "multer";
import { DocumentResolver } from "./resolvers/Document";

const EVENT = "new-chat-message";

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
      Message,
    ],
  });
  const em = getManager();

  const app = express();
  const http = require("http").Server(app);
  const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        ServiceResolver,
        PosteResolver,
        UserResolver,
        ConversationResolver,
        ConvToUserResolver,
        MessageResolver,
        DocumentResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ em, req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false, // we are not setting cors for the Apollo Server (/graphql route) but rather globally with the cors module
  });

  const uploadDocuments = multer({ dest: "dist/uploads/documents/" });
  app.post(
    "/api/documents",
    uploadDocuments.single("documents"),
    function (req, res) {
      res.send(req.file.path);
    }
  );

  app.get("/api/documents", function (req, res) {
    // http://localhost:4000/api/documents?path=dist/uploads/documents/8b0ac21814cc24e0da0ed6f5587326bb&name=CV%20Benoi%CC%82t%20Clemenceau%20v2.5%20FR.pdf
    if (req.query.path && req.query.name) {
      res.download(
        (__dirname.slice(0, -5) + "/" + req.query.path) as string,
        req.query.name as string
      );
    }
  });

  const uploadProfilePics = multer({ dest: "dist/uploads/profilePics/" });
  app.post(
    "/api/profilePics",
    uploadProfilePics.single("profilePics"),
    function (req, res) {
      res.send(req.file.path);
    }
  );

  app.use(express.static('dist/uploads'))

  app.get("/api/profilePics", function (req, res) {
    // http://localhost:4000/api/profilePics?path=dist/uploads/profilePics/fe5e2a08c1a3987ef642f4e257d6523a
    if (req.query.path) {
     res.sendFile(__dirname.slice(0, -5) + "/" + req.query.path)
    }
  });

  io.on("connection", (socket: any) => {
    // Join a conversation
    const { convUuid } = socket.handshake.query;
    socket.join(convUuid);

    // Listen for new messages
    socket.on(EVENT, (data: any) => {
      io.in(convUuid).emit(EVENT, data);
    });

    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
      socket.leave(convUuid);
    });
  });

  http.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
