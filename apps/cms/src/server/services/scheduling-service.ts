import type { ScheduleWindow } from "@playermaster/shared";
import { getRealtimeServer } from "@/lib/realtime";
import { prisma } from "@/lib/prisma";

export class SchedulingService {
  async create(input: {
    name: string;
    playlistId: string;
    screenIds: string[];
    kind: "DAILY" | "WEEKLY" | "DATE_RANGE" | "EMERGENCY";
    priority?: number;
    isEmergency?: boolean;
    window: ScheduleWindow;
  }) {
    const schedule = await prisma.schedule.create({
      data: {
        name: input.name,
        playlistId: input.playlistId,
        kind: input.kind,
        priority: input.priority ?? (input.kind === "EMERGENCY" ? 1000 : 0),
        isEmergency: input.isEmergency ?? input.kind === "EMERGENCY",
        timezone: input.window.timezone,
        startsAt: input.window.startsAt ? new Date(input.window.startsAt) : undefined,
        endsAt: input.window.endsAt ? new Date(input.window.endsAt) : undefined,
        daysOfWeek: input.window.daysOfWeek ?? [],
        startTime: input.window.startTime,
        endTime: input.window.endTime,
        screens: {
          create: input.screenIds.map((screenId) => ({ screenId }))
        }
      },
      include: { screens: true }
    });

    for (const screenId of input.screenIds) {
      getRealtimeServer().emitContentUpdate(screenId);
    }

    return schedule;
  }

  async list() {
    return prisma.schedule.findMany({
      include: { playlist: true, screens: { include: { screen: true } } },
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }]
    });
  }

  async activeForScreen(screenId: string, at = new Date()) {
    const schedules = await prisma.schedule.findMany({
      where: {
        screens: { some: { screenId } },
        OR: [
          { startsAt: null, endsAt: null },
          { startsAt: { lte: at }, endsAt: null },
          { startsAt: null, endsAt: { gte: at } },
          { startsAt: { lte: at }, endsAt: { gte: at } }
        ]
      },
      include: { playlist: { include: { items: { include: { media: true }, orderBy: { order: "asc" } } } } },
      orderBy: [{ isEmergency: "desc" }, { priority: "desc" }]
    });

    return schedules.filter((schedule) => {
      if (schedule.daysOfWeek.length && !schedule.daysOfWeek.includes(at.getUTCDay())) {
        return false;
      }
      return true;
    });
  }
}
