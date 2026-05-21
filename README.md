# MigOculto

MigOculto is a Brazilian-first Secret Santa and gift exchange app for amigo secreto, amigo doce, Christmas, Easter, and other celebrations.

The repository is a pnpm + Turborepo monorepo with a Next.js web/API app, an Expo mobile app, and shared packages for database access, contracts, API client, UI, and i18n.

## Requirements

- Node.js 20 or newer
- pnpm 10
- Docker, for the local PostgreSQL database

## Installation

```sh
pnpm install
cp .env.example .env
docker compose up -d postgres
pnpm db:generate
```

## Scripts

```sh
pnpm dev
pnpm dev:web
pnpm dev:mobile
pnpm build
pnpm typecheck
pnpm test
pnpm coverage
pnpm db:migrate
pnpm db:seed
```

## Apps

- `apps/web`: Next.js App Router public site and REST API under `/api/v1`.
- `apps/mobile`: Expo Router mobile app.

## Packages

- `packages/db`: Prisma schema, migrations, client, and seed data.
- `packages/types`: shared TypeScript contracts for users, groups, messages, wishlist, and API responses.
- `packages/api-client`: shared HTTP client consumed by the mobile app.
- `packages/ui`: reusable web UI primitives using the MigOculto design tokens.
- `packages/i18n`: shared locale helpers and Brazilian Portuguese copy.

## Local Database

The default Docker database uses port `5434` to avoid clashing with a local Postgres on `5432`:

```sh
DATABASE_URL="postgresql://migoculto:migoculto@localhost:5434/migoculto"
```

Prisma commands are run through the DB package:

```sh
pnpm db:check
pnpm db:migrate
pnpm db:seed
```

## Mobile

Set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env` to the web API URL reachable from the device, for example:

```sh
EXPO_PUBLIC_API_URL="http://192.168.0.10:3000/api/v1"
```

Local mobile development uses a separate development build identity:

- Scheme: `migoculto-dev`
- iOS bundle id: `com.cftechsol.migoculto.dev`
- Android package: `com.cftechsol.migoculto.dev`

This keeps the App Store / Play Store app installed on the same device without hijacking the production `migoculto` scheme.

```sh
pnpm build:dev:android
pnpm build:dev:ios
pnpm dev
```

Use `pnpm dev:mobile:go` only for Expo Go-compatible screens. The app includes custom native modules, so the normal local workflow is a development build.
