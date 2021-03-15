# JEECE-collab

[JEECE](https://www.jeece.fr/) web dev technical test.

The goal is to develop a web platform for collaborative work. It will allow employees of a company to communicate via instant messaging, and privileged accounts will be able to distribute documents to the desired departments.

You can find the project instructions there: [instructions.pdf](instructions.pdf)

## Changelog

[CHANGELOG.md](CHANGELOG.md) based on the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

## Tech Stack

### Server
  - Node.js
  - TypeScript
  - PostgreSQL: relational DB ([schema](db.png))
  - TypeORM: Object-Relational Mapping (server to DB)
  - Express
  - GraphQL w/ type-graphql & Apollo Server for API queries (client to server)

### Web
  - React w/ Next.js & Chakra UI
  - TypeScript
  - urql: GraphQL client

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
