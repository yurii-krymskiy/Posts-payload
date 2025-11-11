# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

This project has been customized to use Postgres (via `@payloadcms/db-postgres`) and adds `posts` and `categories` collections with relationships and a join field.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cp test.env .env` (or create your own) and set `DATABASE_URI` to your Postgres connection string, for example:

```
DATABASE_URI=postgresql://postgres:aXafFQKXVdDO@localhost:5432/payload
PAYLOAD_SECRET=dev-secret
```

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. Open `http://localhost:3000` to open the app in your browser.
5. Hit `GET /api/seed` once (or visit `http://localhost:3000/api/seed`) to ensure the test user (`test@test.com` / `test`) exists.
6. Use the `authorizeUser` server action (frontend WIP) to login and then create posts with `createPost`.

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URI` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URI` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

- #### Categories

  Fields: `title`, `slug`, `content`, `owner`, and virtual join field `posts` (shows related posts via post `categories` relationship). All users can read; authenticated users can create/update/delete their own categories.

- #### Posts

  Fields: `title`, `slug`, `categories` (relationship hasMany), `content`, `owner`. Public read, authenticated create/update/delete own posts. Slug auto-generated from title; owner set automatically on create.

### Server Actions

Located in `src/app/server/actions/`:

- `authorizeUser(email, password)` — logs in a user and returns `{ user, token }`.
- `createPost({ title, content, categoryIds }, token)` — creates a post using the auth token from login.

### Seeding

`GET /api/seed` ensures a test user exists for local development.

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
