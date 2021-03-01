# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/benzinho75/JEECE-collab/compare/v0.0.2...HEAD)

### To add

- web

### To fix

### Added

- Token-based authentication w/ jsonwebtoken
- Added front-end structure (React w/ Next.js & Chakra UI)
- Built register page and corresponding components

## [0.0.2](https://github.com/benzinho75/JEECE-collab/compare/v0.0.1...v0.0.2) - 2021-02-28

### Added

- Switched to TypeORM and described the schema => generating the postgres DB in sync mode for the moment
- Set up Express and GraphQL w/ Apollo and type-grapql
- Exposed Service and Poste entities to the GraphQL schema and made the corresponding resolvers w/ CRUD operations
- Exposed User to the graphql schema with register and login mutations
- password hashing with argon2
- email and password testing when registering
- proper error messages

## [0.0.1](https://github.com/benzinho75/JEECE-collab/releases/tag/v0.0.1) - 2021-02-19

### Added

- Initialized server with Node.js and TypeScript
- Set up MikroORM w/ PostgreSQL
