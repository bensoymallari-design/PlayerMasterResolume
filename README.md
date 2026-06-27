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

## Environment

Create `apps/cms/.env.local`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/playermaster"
JWT_SECRET="replace-with-a-long-random-secret"
MEDIA_UPLOAD_DIR="./storage/media"
SOCKET_CORS_ORIGIN="http://localhost:3000"
```

Optional player environment:

```bash
PLAYERMASTER_CMS_URL="http://localhost:3000"
PLAYERMASTER_REGISTRATION_CODE="ABCD1234"
AUTO_UPDATE_URL="https://updates.example.com/playermaster"
```

## Commands

```bash
npm install
npm run prisma:generate
npm run dev
npm run dev:player
npm run typecheck
npm run build
```

## Future-ready extension points

The domain contracts and schema include room for AI camera analytics, audience detection, face counting, motion detection, interactive displays, touch screens, NDI/Spout streams, Colorlight controller integration, multi-screen synchronization, cloud deployment, and SaaS licensing.
