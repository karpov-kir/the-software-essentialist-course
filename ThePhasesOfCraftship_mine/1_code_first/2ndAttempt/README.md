# Code first assignment 2nd attempt

- https://www.essentialist.dev/products/the-software-essentialist/categories/2154344001/posts/2168948146
- https://www.essentialist.dev/products/the-software-essentialist/categories/2154344011/posts/2173535677
- PR: https://github.com/karpov-kir/the-software-essentialist-course/pull/9

## API
- `GET /posts` - get all posts
- `GET /posts/:id?filter=<filter>` - get post by id
  - `filter` - `new` | `popular` | `all` (default)

## How to start locally

- `npm ci`
- `npm run db:migrate`
- `npm run db:seed` (it removes all records and creates new ones)
- `npm run start:dev:backend`
- `npm run start:dev:frontend`
