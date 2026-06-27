import type { ContentManifest } from "@playermaster/shared";
import { prisma } from "@/lib/prisma";
import { SchedulingService } from "@/server/services/scheduling-service";

export class ContentManifestService {
  private readonly scheduling = new SchedulingService();

  async buildForScreen(screenId: string): Promise<ContentManifest> {
    const [screen, schedules] = await Promise.all([
      prisma.screen.findUniqueOrThrow({
        where: { id: screenId },
        include: { layout: { include: { zones: true } } }
      }),
      this.scheduling.activeForScreen(screenId)
    ]);

    const playlists = schedules.map((schedule) => schedule.playlist);
    const mediaById = new Map(
      playlists.flatMap((playlist) => playlist.items.map((item) => [item.media.id, item.media] as const))
    );

    return {
      screenId,
      generatedAt: new Date().toISOString(),
      layout: screen.layout
        ? {
            id: screen.layout.id,
            name: screen.layout.name,
            description: screen.layout.description ?? undefined,
            resolutionWidth: screen.layout.resolutionWidth,
            resolutionHeight: screen.layout.resolutionHeight,
            isTemplate: screen.layout.isTemplate,
            createdAt: screen.layout.createdAt.toISOString(),
            updatedAt: screen.layout.updatedAt.toISOString(),
            zones: screen.layout.zones.map((zone) => ({
              id: zone.id,
              layoutId: zone.layoutId,
              name: zone.name,
              kind: zone.kind,
              rect: {
                x: zone.x,
                y: zone.y,
                width: zone.width,
                height: zone.height,
                zIndex: zone.zIndex
              },
              config: zone.config as Record<string, unknown>,
              createdAt: zone.createdAt.toISOString(),
              updatedAt: zone.updatedAt.toISOString()
            }))
          }
        : undefined,
      playlists: playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description ?? undefined,
        durationSeconds: playlist.durationSeconds,
        isPublished: playlist.isPublished,
        createdAt: playlist.createdAt.toISOString(),
        updatedAt: playlist.updatedAt.toISOString(),
        items: playlist.items.map((item) => ({
          id: item.id,
          playlistId: item.playlistId,
          mediaId: item.mediaId,
          order: item.order,
          durationSeconds: item.durationSeconds,
          transition: item.transition as "CUT" | "FADE" | undefined,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString()
        }))
      })),
      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        name: schedule.name,
        kind: schedule.kind,
        playlistId: schedule.playlistId,
        screenIds: [screenId],
        priority: schedule.priority,
        isEmergency: schedule.isEmergency,
        window: {
          timezone: schedule.timezone,
          startsAt: schedule.startsAt?.toISOString(),
          endsAt: schedule.endsAt?.toISOString(),
          daysOfWeek: schedule.daysOfWeek,
          startTime: schedule.startTime ?? undefined,
          endTime: schedule.endTime ?? undefined
        },
        createdAt: schedule.createdAt.toISOString(),
        updatedAt: schedule.updatedAt.toISOString()
      })),
      media: [...mediaById.values()].map((media) => ({
        id: media.id,
        title: media.title,
        kind: media.kind,
        mimeType: media.mimeType,
        fileName: media.fileName ?? undefined,
        storagePath: media.storagePath ?? undefined,
        externalUrl: media.externalUrl ?? undefined,
        durationSeconds: media.durationSeconds ?? undefined,
        checksum: media.checksum ?? undefined,
        sizeBytes: media.sizeBytes ? Number(media.sizeBytes) : undefined,
        category: media.category ?? undefined,
        tags: media.tags,
        thumbnailUrl: media.thumbnailUrl ?? undefined,
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString()
      }))
    };
  }
}
