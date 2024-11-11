# Code first assignment

- Assignment: https://www.essentialist.dev/products/the-software-essentialist/categories/2154344011/posts/2173535677
- PR: https://github.com/karpov-kir/the-software-essentialist-course/pull/8

WARNING: This attempt was implemented in very early stages of the course, so the implementation does not meet the latest course requirements.

## API

- `POST /users`: Creates a new user
- `PUT /users/:userId`: Edits a user
- `GET /users?email=someuser@gmail.com`: Fetches a user by their email

## How to start locally

```
npm ci && npm run prisma:generate prisma:migrate
npm run start:dev
```

Examples:

```
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"email": "test@mail.com", "firstName": "John", "lastName": "Doe"}'
curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d '{"firstName": "Jane"}'
curl -X GET 'http://localhost:3000/users?email=test@mail.com'
```
