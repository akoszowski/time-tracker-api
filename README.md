# Time tracker backend API

Startup House junior back-end developer recruitment task.

## Running the project

1. Clone the repo.
2. Install node modules.
```bash
$ npm install
```
3. If you are satisfied with .env.example config just rename it to .env
4. Launch dockerised PostgreSQL database (PORT: 5432).
```bash
$ npm run docker:db
```
5. Deploy Prisma migration.
```bash
$ npm run migrate:deploy
```
6. Generate Prisma Client JS
```bash
$ npm run prisma:generate
```
7. Start NestJS application
```bash
$ npm run start
```
8. Under link, you will find GraphQL API playground with generated documentation:
```http request
http://localhost:3000/graphql
```
9. To run test, just use command:
```bash
$ npm run test
```
10. To see test coverage, use command:
```bash
$ npm run test:cov
```

---

## Solution:
- application written in NestJS
- GraphQL approach
- dockerised PostgreSQL database
- Prisma ORM

I did put no constraints on database schema (e.x. unique for name of the task, for me it seemed quite 
reasonable that user may want to create tasks witht the same name).

I have decided to implement one more query endpoint, namely: getting already finished task.
These way, it would be easier to see what happens with stopped tasks.  

Solution can be played with at the GraphQL playground. According to many, GraphQL apporach is self documenting. 
For that reason, I have decided to add more descriptive comments that can be easily found in 'docs' and 'schema' bookmarks
at the playground page.

I have written unit tests. Coverage is almost 90%. However, I am not sure, whether my unit test approach is a good one.
I was patterning myself on tutorials found on website/ YouTube. I will be glad to hear some tips on how I can improve this process :)

Unfortunately, I did not manage on time to fully dockerise or deploy my app at the Heroku.

All in all, it will be great to hear what could be done in a better way or with a different approach in my solution

## Additional comments

I have a few ideas how this app may be improved:
- enabling user to stop (but not finish) the task, then for example after some time such a task could be resumed
  (for that reason I created enum field status which may be further extended), additionally these improvement would require 
  one-to-many relationship with Timer entities,
- enabling user to extend Task model, for example task priority, project or general labels some  may be added,
- adding user entity, account creation and authorization,
- developing app so that it could handle concurrent requests from many users (e.x with nested writes and db isolation).

