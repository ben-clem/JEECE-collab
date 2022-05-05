# JEECE-collab

[JEECE](https://www.jeece.fr/) web dev technical test.

The goal is to develop a web platform for collaborative work. It will allow employees of a company to communicate via instant messaging, and privileged accounts will be able to distribute documents to the desired departments.

You can find the full project requirements here (in French): [instructions.pdf](instructions.pdf)

## Changelog

[CHANGELOG.md](CHANGELOG.md) based on the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

## Tech Stack

## Server

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/): relational DB (schema)
- [TypeORM](https://typeorm.io/): Object-Relational Mapping (server to DB)
- [Express](https://expressjs.com/)
- [GraphQL](https://graphql.org/) w/ [type-graphql](https://typegraphql.com) & [Apollo Server](https://www.apollographql.com/docs/apollo-server) for API queries (client to server)

## Web

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/) w/ [Next.js](https://nextjs.org/) & [Chakra UI](https://chakra-ui.com/)
- [urql](https://formidable.com/open-source/urql/): GraphQL client
- [Socket.IO](https://socket.io/)
- [Formik](https://formik.org/)
- [FilePond](https://pqina.nl/filepond/)

## Install

1. Clone project

```
git clone https://github.com/benzinho75/JEECE-collab
```

2. Install dependencies

```
cd server
yarn install

cd ../web
yarn install
```

3. Install PostgreSQL if you haven't

https://www.postgresql.org/download/<br>
Also set up a (postgres, postgres) user and create the JEECE-collab database.

## Usage

1. Start server

```
cd server
yarn watch
```
```
yarn dev
```

2. Start web

```
cd ../web
yarn dev
```

## Progression

1. Fonctionnalités profils utilisateurs :white_check_mark:
   - Module d’authentification/inscription :white_check_mark:
   - Page d’accueil :white_check_mark:
   - Barre de recherche et nouvelles conversations :white_check_mark:
   - Conversations :white_check_mark:
2. Fonctionnalités back-office (soft) :white_check_mark:
   - Module d’authentification/inscription :white_check_mark:
   - Fonctionnalités communes :white_check_mark:
   - Dépôts de documents (pdf) :white_check_mark:
   - Acceptation/refus de nouvel utilisateur :white_check_mark:

## Sources

[Ben Awad's Fullstack React GraphQL TypeScript Tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8)

## Author

Benoît Clemenceau <b.clemenceau.pro@gmail.com> (https://github.com/benzinho75)
