-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('VIDEO', 'IMAGE', 'GIF', 'HTML_WIDGET', 'WEBSITE', 'YOUTUBE', 'LIVE_STREAM', 'NDI');

-- CreateEnum
CREATE TYPE "ScreenStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DEGRADED');

-- CreateEnum
CREATE TYPE "ScheduleKind" AS ENUM ('DAILY', 'WEEKLY', 'DATE_RANGE', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "ZoneKind" AS ENUM ('VIDEO', 'IMAGE', 'CLOCK', 'WEATHER', 'NEWS_TICKER', 'HTML_WIDGET', 'WEBSITE', 'TEXT');

-- CreateEnum
CREATE TYPE "WidgetKind" AS ENUM ('CLOCK', 'WEATHER', 'NEWS', 'TEXT');

-- CreateEnum
CREATE TYPE "PlayerCommandKind" AS ENUM ('RESTART_PLAYER', 'REFRESH_CONTENT', 'REBOOT_DEVICE', 'CLEAR_CACHE', 'SCREENSHOT_DEVICE', 'CHANGE_PLAYLIST');

-- CreateEnum
CREATE TYPE "PlayerCommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationCode" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "status" "ScreenStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastHeartbeatAt" TIMESTAMP(3),
    "currentContent" TEXT,
    "currentPlaylistId" TEXT,
    "currentLayoutId" TEXT,
    "screenshotUrl" TEXT,
    "cpuUsagePercent" DOUBLE PRECISION,
    "ramUsagePercent" DOUBLE PRECISION,
    "diskUsagePercent" DOUBLE PRECISION,
    "appVersion" TEXT,
    "osVersion" TEXT,
    "monitorCount" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT,
    "storagePath" TEXT,
    "externalUrl" TEXT,
    "durationSeconds" INTEGER,
    "checksum" TEXT,
    "sizeBytes" BIGINT,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thumbnailUrl" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "transition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playlistId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ScheduleKind" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "daysOfWeek" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "startTime" TEXT,
    "endTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleScreen" (
    "scheduleId" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,

    CONSTRAINT "ScheduleScreen_pkey" PRIMARY KEY ("scheduleId","screenId")
);

-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resolutionWidth" INTEGER NOT NULL DEFAULT 1920,
    "resolutionHeight" INTEGER NOT NULL DEFAULT 1080,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "ZoneKind" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "layoutId" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "WidgetKind" NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerLog" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "screenId" TEXT NOT NULL,

    CONSTRAINT "PlayerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCommand" (
    "id" TEXT NOT NULL,
    "kind" "PlayerCommandKind" NOT NULL,
    "status" "PlayerCommandStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "error" TEXT,
    "screenId" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,

    CONSTRAINT "PlayerCommand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Screen_registrationCode_key" ON "Screen"("registrationCode");

-- CreateIndex
CREATE INDEX "Screen_status_idx" ON "Screen"("status");

-- CreateIndex
CREATE INDEX "Screen_lastHeartbeatAt_idx" ON "Screen"("lastHeartbeatAt");

-- CreateIndex
CREATE INDEX "Media_kind_idx" ON "Media"("kind");

-- CreateIndex
CREATE INDEX "Media_category_idx" ON "Media"("category");

-- CreateIndex
CREATE INDEX "Media_tags_idx" ON "Media" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "Playlist_isPublished_idx" ON "Playlist"("isPublished");

-- CreateIndex
CREATE INDEX "PlaylistItem_mediaId_idx" ON "PlaylistItem"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_playlistId_order_key" ON "PlaylistItem"("playlistId", "order");

-- CreateIndex
CREATE INDEX "Schedule_kind_priority_idx" ON "Schedule"("kind", "priority");

-- CreateIndex
CREATE INDEX "Schedule_startsAt_endsAt_idx" ON "Schedule"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Layout_isTemplate_idx" ON "Layout"("isTemplate");

-- CreateIndex
CREATE INDEX "Zone_layoutId_zIndex_idx" ON "Zone"("layoutId", "zIndex");

-- CreateIndex
CREATE INDEX "PlayerLog_screenId_createdAt_idx" ON "PlayerLog"("screenId", "createdAt");

-- CreateIndex
CREATE INDEX "PlayerLog_level_idx" ON "PlayerLog"("level");

-- CreateIndex
CREATE INDEX "PlayerCommand_screenId_status_idx" ON "PlayerCommand"("screenId", "status");

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_currentPlaylistId_fkey" FOREIGN KEY ("currentPlaylistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_currentLayoutId_fkey" FOREIGN KEY ("currentLayoutId") REFERENCES "Layout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleScreen" ADD CONSTRAINT "ScheduleScreen_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleScreen" ADD CONSTRAINT "ScheduleScreen_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLog" ADD CONSTRAINT "PlayerLog_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCommand" ADD CONSTRAINT "PlayerCommand_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCommand" ADD CONSTRAINT "PlayerCommand_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
