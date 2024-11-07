# Code first assignment

https://www.essentialist.dev/products/the-software-essentialist/categories/2154344011/posts/2173535677

## API

- `POST /users`: Creates a new user
- `PUT /users/:userId`: Edits a user
- `GET /users?email=someuser@gmail.com`: Fetches a user by their email

## How to start locally

```
npm ci
cd src
npx prisma generate
npx prisma migrate deploy
npm run start
```
