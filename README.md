# Club Vertikal

Web application for managing memberships, courses, and registrations for Club Vertikal. Built with Next.js, Prisma (SQLite), Stripe, and Resend.

## Prerequisites

- Node.js >= 20
- npm

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd vertikal-club
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

> **Important:** Copy to `.env`, not `.env.local`. Prisma reads `.env` via `dotenv/config` and does not support `.env.local`.

See [`.env.example`](.env.example) for all available variables. For local development, the defaults for `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, and `DATABASE_URL` work out of the box. You only need to set the Stripe and Resend keys if you want to test payments or emails.

4. Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

5. (Optional) Seed the database with sample data:

```bash
npm run db:seed
```

6. (Optional) Create an admin user:

```bash
npm run admin:create
```

## Development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Useful Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:reset` | Reset the database and re-run migrations |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run admin:create` | Create an admin user |
| `npm run email:dev` | Start the email template preview server |

## Email Templates (Local Preview)

The project includes email templates built with [react-email](https://react.email). To preview them locally:

```bash
npm run email:dev
```

This starts a preview server at [http://localhost:3001](http://localhost:3001) where you can browse and test the templates with sample data. On first run it will prompt to install `@react-email/preview-server`.

## Stripe Webhooks (Local)

To test Stripe webhooks locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret it prints and set it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`.
