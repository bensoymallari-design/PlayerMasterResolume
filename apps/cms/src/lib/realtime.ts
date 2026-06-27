import { Server } from "socket.io";
import type { PlayerCommand, PlayerHeartbeat } from "@playermaster/shared";
import { configuredSocketOrigins, isAllowedLocalOrigin, localNetworkOnlyEnabled } from "@/lib/local-network";
import { prisma } from "@/lib/prisma";

export interface RealtimeServer {
  io: Server;
  emitCommand(command: PlayerCommand): void;
  emitContentUpdate(screenId: string): void;
}

const globalRealtime = globalThis as unknown as { realtime?: RealtimeServer };

export function getRealtimeServer(): RealtimeServer {
  if (globalRealtime.realtime) {
    return globalRealtime.realtime;
  }

  const io = new Server({
    cors: {
      origin(origin, callback) {
        if (localNetworkOnlyEnabled() && !isAllowedLocalOrigin(origin)) {
          callback(new Error("PlayerMaster is configured for local network access only"));
          return;
        }

        const configured = configuredSocketOrigins();
        if (configured === true || !origin || configured.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Socket origin is not allowed"));
      },
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("screen:join", async ({ screenId }: { screenId: string }) => {
      socket.join(screenRoom(screenId));
      await prisma.screen.update({
        where: { id: screenId },
        data: { status: "ONLINE", lastHeartbeatAt: new Date() }
      });
      io.to("cms").emit("screen:status", { screenId, status: "ONLINE" });
    });

    socket.on("cms:join", () => {
      socket.join("cms");
    });

    socket.on("screen:heartbeat", async (heartbeat: PlayerHeartbeat) => {
      await prisma.screen.update({
        where: { id: heartbeat.screenId },
        data: {
          status: heartbeat.status,
          lastHeartbeatAt: new Date(heartbeat.timestamp),
          currentContent: heartbeat.currentContent,
          cpuUsagePercent: heartbeat.telemetry.cpuUsagePercent,
          ramUsagePercent: heartbeat.telemetry.ramUsagePercent,
          diskUsagePercent: heartbeat.telemetry.diskUsagePercent,
          appVersion: heartbeat.telemetry.appVersion,
          osVersion: heartbeat.telemetry.osVersion,
          screenshotUrl: heartbeat.telemetry.screenshotUrl
        }
      });
      io.to("cms").emit("screen:heartbeat", heartbeat);
    });

    socket.on("screen:command:ack", async ({ commandId }: { commandId: string }) => {
      await prisma.playerCommand.update({
        where: { id: commandId },
        data: { status: "ACKNOWLEDGED", acknowledgedAt: new Date() }
      });
      io.to("cms").emit("command:ack", { commandId });
    });
  });

  globalRealtime.realtime = {
    io,
    emitCommand(command) {
      io.to(screenRoom(command.screenId)).emit("player:command", command);
      io.to("cms").emit("player:command", command);
    },
    emitContentUpdate(screenId) {
      io.to(screenRoom(screenId)).emit("content:update", { screenId });
      io.to("cms").emit("content:update", { screenId });
    }
  };

  return globalRealtime.realtime;
}

function screenRoom(screenId: string): string {
  return `screen:${screenId}`;
}
