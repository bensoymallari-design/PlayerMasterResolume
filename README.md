# PlayerMaster

PlayerMaster is a production-oriented digital signage platform scaffold for CMS-driven media management, realtime player monitoring, zone-based layouts, offline Electron playback, and Resolume OSC integration.

## Architecture

```text
apps/
  cms/                 Next.js 15 CMS, API routes, Prisma, Socket.IO, dashboard UI
  player/              Electron kiosk player with React renderer and offline sync
packages/
  shared/              Cross-app TypeScript contracts
  resolume/            Reusable OSC service for Resolume control
```

## Core workflow

```text
CMS -> Upload Media -> Create Playlist -> Assign Schedule -> Publish
Player -> Register -> Sync Manifest -> Cache Media -> Play Offline -> Reconnect
```

## Implemented foundation

- Next.js CMS shell with dark enterprise dashboard styling.
- JWT cookie authentication helpers and login/logout API routes.
- Prisma PostgreSQL schema for users, screens, media, playlists, playlist items, schedules, layouts, zones, widgets, player logs, and remote commands.
- Media library services for upload, delete, search, categories, tags, external URLs, websites, YouTube, live streams, and future NDI entries.
- Playlist services for create, add media, reorder, duration calculation, duplicate, and publish.
- Scheduling service for daily, weekly, date-range, priority, and emergency override assignments.
- Socket.IO service for content updates, screen status, heartbeats, monitoring broadcasts, and remote commands.
- Zone-based layout model and editor scaffold with reusable templates.
- Built-in widget renderers for clock, weather, news ticker, and text/emergency messages.
- Electron player with fullscreen kiosk launch, hardware acceleration flags, auto update hook, reconnecting Socket.IO client, offline manifest fallback, local media cache, multi-monitor awareness, and command handling.
- Resolume OSC TypeScript service for clip, column, layer, opacity, visibility, and text-layer commands.

## Local network only setup

PlayerMaster is configured for private LAN use by default. The CMS middleware and Socket.IO setup reject non-local hosts/origins while `LOCAL_NETWORK_ONLY="true"`.

1. Install dependencies:

```bash
npm install
```

2. Start local PostgreSQL. The database port is bound to `127.0.0.1` only, so it is not exposed to the LAN:

```bash
npm run db:local:up
```

3. Create the CMS environment file:

```bash
cp apps/cms/.env.local.example apps/cms/.env.local
```

Edit `JWT_SECRET` and `SEED_ADMIN_PASSWORD`. Keep `LOCAL_NETWORK_ONLY="true"`.

4. Prepare the database and seed a local admin:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

5. Find the CMS machine LAN URL:

```bash
npm run local:ip
```

Add the printed URL, for example `http://192.168.1.50:3000`, to `SOCKET_CORS_ORIGIN` in `apps/cms/.env.local`.

6. Start the CMS for LAN devices:

```bash
npm run dev:lan
```

Open the CMS on the server machine at `http://localhost:3000`, or from another device on the same network using the LAN URL from step 5.

7. Configure a player:

```bash
cp apps/player/.env.local.example apps/player/.env.local
```

Set `PLAYERMASTER_CMS_URL` to the CMS LAN URL and set `PLAYERMASTER_REGISTRATION_CODE` to the code generated after creating a screen in the CMS.

8. Start the local player:

```bash
npm run dev:player:local
```

### Local-only security notes

- Do not port-forward the CMS or database from your router.
- Keep the database on `127.0.0.1`; only the CMS should listen on the LAN.
- Use a strong `JWT_SECRET` and change the seeded admin password.
- If you intentionally need public/cloud access later, set `LOCAL_NETWORK_ONLY="false"` and review CORS, TLS, authentication, and firewall rules first.

## Environment

Create `apps/cms/.env.local`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/playermaster"
JWT_SECRET="replace-with-a-long-random-secret"
MEDIA_UPLOAD_DIR="./storage/media"
LOCAL_NETWORK_ONLY="true"
SOCKET_CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000,http://192.168.1.50:3000"
```

Optional player environment:

```bash
PLAYERMASTER_CMS_URL="http://localhost:3000"
PLAYERMASTER_REGISTRATION_CODE="ABCD1234"
AUTO_UPDATE_URL=""
```

## Commands

```bash
npm install
npm run db:local:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run local:ip
npm run dev
npm run dev:lan
npm run dev:player
npm run dev:player:local
npm run typecheck
npm run build
```

## Future-ready extension points

The domain contracts and schema include room for AI camera analytics, audience detection, face counting, motion detection, interactive displays, touch screens, NDI/Spout streams, Colorlight controller integration, multi-screen synchronization, cloud deployment, and SaaS licensing.
