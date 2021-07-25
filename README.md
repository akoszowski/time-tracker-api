# Time tracker backend API

Startup House junior back-end developer recruitment task.

## Running the project

1. Clone the repo.
2. Install node modules.
```bash
$ npm install
```
3. Launch dockerised PostgreSQL database.
```bash
$ npm run docker:db
```
4. Deploy Prisma migration.
```bash
$ npm run migrate:deploy
```
5. Start NestJS application
```bash
$ npm run start
```
6. Under link, you will find GraphQL API playground with generated documentation:
```http request
http://localhost:3000/graphql
```
7. To run test, just use command:
```bash
$ npm run test
```
