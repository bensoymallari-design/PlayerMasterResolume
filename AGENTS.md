# AGENTS.md

## Cursor Cloud specific instructions

PlayerMaster is an npm-workspaces monorepo (`apps/cms`, `apps/player`, `packages/shared`, `packages/resolume`). Standard commands live in the root `README.md` and `package.json` scripts; this section only captures non-obvious startup/run caveats for the cloud environment.

### Services overview
- `apps/cms` — Next.js 15 CMS (the primary runnable app). Dev server: `npm run dev` (serves `http://localhost:3000`). Requires a running PostgreSQL and `apps/cms/.env.local`.
- `apps/player` — Electron kiosk player. It is a desktop GUI/kiosk app; it builds (`npm run build`) and typechecks but is not meaningful to "run" headless in the cloud. Use `npm run dev:player` only on a machine with a display.
- `packages/shared`, `packages/resolume` — TypeScript libraries (no build/run; typecheck only).

### PostgreSQL (required for the CMS, not started by the update script)
The update script intentionally does not start services. Each session, start Postgres and ensure the database exists before running the CMS:
- Start: `sudo pg_ctlcluster 16 main start`
- The dev DB/user are: database `playermaster`, user `postgres`, password `postgres`, on `localhost:5432`. If a fresh cluster, (re)create with:
  - `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"`
  - `sudo -u postgres psql -c "CREATE DATABASE playermaster;"`
- Apply the schema (no migrations are committed, so use db push): from `apps/cms`, run `npx prisma db push`.

### CMS environment file
`apps/cms/.env.local` is gitignored and must exist for the CMS to boot (`JWT_SECRET` is mandatory; auth throws without it). Minimal dev values:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/playermaster"
JWT_SECRET="dev-only-secret-please-change-0123456789abcdef0123456789abcdef"
MEDIA_UPLOAD_DIR="./storage/media"
SOCKET_CORS_ORIGIN="http://localhost:3000"
```

### Seeding a login user
There is no committed seed script. The CMS login authenticates against the `User` table (bcrypt hash). To create an admin for manual/login testing, run a one-off script from the repo root (so workspace `node_modules` resolves) that upserts a user via `@prisma/client` + `@prisma/adapter-pg` + `bcryptjs`. Reference dev credentials used during setup: `admin@example.com` / `password123`.

### Known caveats / gotchas
- `npm run lint` (`next lint`) is interactive in this scaffold (no committed ESLint config) and will prompt + rewrite `apps/cms/tsconfig.json`; it cannot complete non-interactively. Treat lint as not configured rather than failing on it.
- Running `next dev`/`next build` auto-edits `apps/cms/tsconfig.json` (adds `.next/types/**/*.ts`) and `apps/cms/next-env.d.ts`. These are expected Next.js regenerations; do not commit them.
- Pre-existing UI defect (not an environment problem): `apps/cms/src/app/globals.css` uses Tailwind v3 directives (`@tailwind base/components/utilities`) while the project installs Tailwind v4, so utility classes are not generated and pages render largely unstyled. App functionality (auth, API, DB) is unaffected.
