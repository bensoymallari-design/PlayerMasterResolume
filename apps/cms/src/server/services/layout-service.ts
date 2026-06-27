import type { Prisma } from "@prisma/client";
import type { ZoneRect } from "@playermaster/shared";
import { prisma } from "@/lib/prisma";

export class LayoutService {
  async listTemplates() {
    return prisma.layout.findMany({
      where: { isTemplate: true },
      include: { zones: { orderBy: { zIndex: "asc" } } },
      orderBy: { updatedAt: "desc" }
    });
  }

  async create(input: {
    name: string;
    description?: string;
    resolutionWidth?: number;
    resolutionHeight?: number;
    isTemplate?: boolean;
    zones: Array<{
      name: string;
      kind: "VIDEO" | "IMAGE" | "CLOCK" | "WEATHER" | "NEWS_TICKER" | "HTML_WIDGET" | "WEBSITE" | "TEXT";
      rect: ZoneRect;
      config?: Record<string, unknown>;
    }>;
  }) {
    return prisma.layout.create({
      data: {
        name: input.name,
        description: input.description,
        resolutionWidth: input.resolutionWidth ?? 1920,
        resolutionHeight: input.resolutionHeight ?? 1080,
        isTemplate: input.isTemplate ?? false,
        zones: {
          create: input.zones.map((zone) => ({
            name: zone.name,
            kind: zone.kind,
            x: zone.rect.x,
            y: zone.rect.y,
            width: zone.rect.width,
            height: zone.rect.height,
            zIndex: zone.rect.zIndex,
            config: (zone.config ?? {}) as Prisma.InputJsonValue
          }))
        }
      },
      include: { zones: true }
    });
  }

  async assignToScreen(screenId: string, layoutId: string) {
    return prisma.screen.update({
      where: { id: screenId },
      data: { currentLayoutId: layoutId },
      include: { layout: { include: { zones: true } } }
    });
  }
}
