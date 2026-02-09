This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Prisma

Apply DB migration

```
npx prisma migrate dev
```

Generate prisma client from schema

```
npx prisma generate
```

Fill with mock data

```
npm run db:seed
```

Run prisma studio (visual interface for DB)

```
npx prisma studio
```
