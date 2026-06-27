# AGENTS.md

## Cursor Cloud specific instructions

PlayerMaster is an npm-workspaces monorepo: `apps/cms` (Next.js 15 CMS + API + embedded Socket.IO), `apps/player` (Electron kiosk player), and the `packages/shared` / `packages/resolume` TS libraries. Standard commands are documented in `README.md` and the root `package.json` scripts; the notes below only cover non-obvious cloud caveats.

### Database (PostgreSQL) — native, not Docker
This VM has no Docker, so the documented `npm run db:local:up` / `db:local:down` scripts do NOT work here. Instead, native PostgreSQL 16 is installed and serves the exact DB the app expects (`postgres:postgres@localhost:5432/playermaster`).
- Start it if it isn't running: `sudo pg_ctlcluster 16 main start`
- The cluster data dir (and all migrated/seeded data) persists in the VM snapshot, so you normally don't need to re-migrate or re-seed.

### Env files
`apps/cms/.env.local` is gitignored but already created during setup (and persists in the snapshot). It must exist for the CMS to run. If missing, copy `apps/cms/.env.local.example` and set a real `JWT_SECRET`; keep `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/playermaster"`.

### Running / testing
- CMS dev server: `npm run dev` → http://localhost:3000 (Socket.IO runs inside this process, not a separate port). Seeded admin login: `admin@playermaster.local` / `change-me-local-only`.
- `npm run dev` / `npm run build` auto-rewrite `apps/cms/next-env.d.ts` and `apps/cms/tsconfig.json` (Next.js TS bootstrap). These edits are noise — do not commit them.
- Lint: `npm run lint` runs `next lint`, which is unconfigured in this repo and prompts interactively ("How would you like to configure ESLint?"), so it cannot run non-interactively. Use `npm run typecheck` for static checks instead.
- The CMS dashboard pages (Screens, Playlists, Media, etc.) are mostly UI scaffolds (`FeaturePage` placeholders). The real functionality lives in the `/api/*` routes (e.g. `POST /api/auth/login`, `POST /api/screens`); exercise those directly when validating backend behavior.
- The Player is an Electron GUI app needing a display; running it headless requires a virtual display (e.g. Xvfb).
