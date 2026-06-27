export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";

export type MediaKind =
  | "VIDEO"
  | "IMAGE"
  | "GIF"
  | "HTML_WIDGET"
  | "WEBSITE"
  | "YOUTUBE"
  | "LIVE_STREAM"
  | "NDI";

export type ScreenStatus = "ONLINE" | "OFFLINE" | "DEGRADED";

export type ZoneKind =
  | "VIDEO"
  | "IMAGE"
  | "CLOCK"
  | "WEATHER"
  | "NEWS_TICKER"
  | "HTML_WIDGET"
  | "WEBSITE"
  | "TEXT";

export type WidgetKind = "CLOCK" | "WEATHER" | "NEWS" | "TEXT";

export type ScheduleKind = "DAILY" | "WEEKLY" | "DATE_RANGE" | "EMERGENCY";

export type PlayerCommandKind =
  | "RESTART_PLAYER"
  | "REFRESH_CONTENT"
  | "REBOOT_DEVICE"
  | "CLEAR_CACHE"
  | "SCREENSHOT_DEVICE"
  | "CHANGE_PLAYLIST";

export interface AuditFields {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends AuditFields {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface MediaAsset extends AuditFields {
  title: string;
  kind: MediaKind;
  mimeType: string;
  fileName?: string;
  storagePath?: string;
  externalUrl?: string;
  durationSeconds?: number;
  checksum?: string;
  sizeBytes?: number;
  category?: string;
  tags: string[];
  thumbnailUrl?: string;
}

export interface PlaylistItem extends AuditFields {
  playlistId: string;
  mediaId: string;
  order: number;
  durationSeconds: number;
  transition?: "CUT" | "FADE";
}

export interface Playlist extends AuditFields {
  name: string;
  description?: string;
  items: PlaylistItem[];
  durationSeconds: number;
  isPublished: boolean;
}

export interface ScheduleWindow {
  timezone: string;
  startsAt?: string;
  endsAt?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
}

export interface Schedule extends AuditFields {
  name: string;
  kind: ScheduleKind;
  playlistId: string;
  screenIds: string[];
  priority: number;
  isEmergency: boolean;
  window: ScheduleWindow;
}

export interface ZoneRect {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface Zone extends AuditFields {
  layoutId: string;
  name: string;
  kind: ZoneKind;
  rect: ZoneRect;
  config: Record<string, unknown>;
}

export interface LayoutTemplate extends AuditFields {
  name: string;
  description?: string;
  resolutionWidth: number;
  resolutionHeight: number;
  zones: Zone[];
  isTemplate: boolean;
}

export interface WidgetConfig extends AuditFields {
  name: string;
  kind: WidgetKind;
  config: Record<string, unknown>;
}

export interface ScreenTelemetry {
  cpuUsagePercent?: number;
  ramUsagePercent?: number;
  diskUsagePercent?: number;
  appVersion?: string;
  osVersion?: string;
  playerUptimeSeconds?: number;
  currentContent?: string;
  screenshotUrl?: string;
}

export interface Screen extends AuditFields {
  name: string;
  registrationCode: string;
  status: ScreenStatus;
  lastHeartbeatAt?: string;
  currentPlaylistId?: string;
  currentLayoutId?: string;
  telemetry: ScreenTelemetry;
  monitorCount: number;
}

export interface ContentManifest {
  screenId: string;
  generatedAt: string;
  layout?: LayoutTemplate;
  playlists: Playlist[];
  media: MediaAsset[];
  schedules: Schedule[];
  emergencyMessage?: string;
}

export interface PlayerCommand {
  id: string;
  screenId: string;
  kind: PlayerCommandKind;
  payload?: Record<string, unknown>;
  issuedAt: string;
  issuedBy: string;
}

export interface PlayerHeartbeat {
  screenId: string;
  status: ScreenStatus;
  telemetry: ScreenTelemetry;
  currentContent?: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
