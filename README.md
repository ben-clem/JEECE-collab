# JEECE-collab

[JEECE](https://www.jeece.fr/) web dev technical test.

The goal is to develop a web platform for collaborative work. It will allow employees of a company to communicate via instant messaging, and privileged accounts will be able to distribute documents to the desired departments.

You can find the project instructions there: [instructions.pdf](instructions.pdf)

## Changelog

[CHANGELOG.md](CHANGELOG.md) based on the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) convention.

## Tech Stack

- server
  - Node.js
  - TypeScript
  - PostgreSQL: relational DB
  - TypeORM: Object-Relational Mapping (server to DB)
  - Express
  - GraphQL w/ type-graphql & Apollo Server for API queries (client to server)
- web
  - React w/ Next.js & Chakra UI
  - TypeScript
  - urql: GraphQL client

## Progression

1. Fonctionnalités profils utilisateurs
    - Module d’authentification/inscription :white_check_mark:
    - Page d’accueil : manque documents et sorting
    - Barre de recherche et nouvelles conversations : manque photos de profil
    - Conversations :white_check_mark:

2. Fonctionnalités back-office (soft) :white_check_mark:
    - Module d’authentification/inscription :white_check_mark:
    - Fonctionnalités communes :white_check_mark:
    - Dépôts de documents (pdf) :white_check_mark:
    - Acceptation/refus de nouvel utilisateur :white_check_mark:

## Install

## Usage

## Sources

[Ben Awad's Fullstack React GraphQL TypeScript Tutorial](https://www.youtube.com/watch?v=I6ypD7qv3Z8)

## Author

Benoît Clemenceau <b.clemenceau.pro@gmail.com> (https://github.com/benzinho75)
