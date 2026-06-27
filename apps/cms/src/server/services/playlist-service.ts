import { prisma } from "@/lib/prisma";

export class PlaylistService {
  async list() {
    return prisma.playlist.findMany({
      include: { items: { include: { media: true }, orderBy: { order: "asc" } } },
      orderBy: { updatedAt: "desc" }
    });
  }

  async create(input: { name: string; description?: string }) {
    return prisma.playlist.create({ data: input });
  }

  async addItem(input: {
    playlistId: string;
    mediaId: string;
    durationSeconds?: number;
    transition?: string;
  }) {
    const [media, lastItem] = await Promise.all([
      prisma.media.findUniqueOrThrow({ where: { id: input.mediaId } }),
      prisma.playlistItem.findFirst({
        where: { playlistId: input.playlistId },
        orderBy: { order: "desc" }
      })
    ]);

    const item = await prisma.playlistItem.create({
      data: {
        playlistId: input.playlistId,
        mediaId: input.mediaId,
        order: (lastItem?.order ?? 0) + 1,
        durationSeconds: input.durationSeconds ?? media.durationSeconds ?? 10,
        transition: input.transition
      }
    });

    await this.recalculateDuration(input.playlistId);
    return item;
  }

  async reorder(playlistId: string, orderedItemIds: string[]) {
    await prisma.$transaction(
      orderedItemIds.map((id, index) =>
        prisma.playlistItem.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );
    await this.recalculateDuration(playlistId);
    return this.get(playlistId);
  }

  async duplicate(playlistId: string) {
    const source = await prisma.playlist.findUniqueOrThrow({
      where: { id: playlistId },
      include: { items: true }
    });

    return prisma.playlist.create({
      data: {
        name: `${source.name} Copy`,
        description: source.description,
        durationSeconds: source.durationSeconds,
        items: {
          create: source.items.map((item) => ({
            mediaId: item.mediaId,
            order: item.order,
            durationSeconds: item.durationSeconds,
            transition: item.transition
          }))
        }
      },
      include: { items: true }
    });
  }

  async publish(playlistId: string) {
    return prisma.playlist.update({
      where: { id: playlistId },
      data: { isPublished: true }
    });
  }

  async get(playlistId: string) {
    return prisma.playlist.findUniqueOrThrow({
      where: { id: playlistId },
      include: { items: { include: { media: true }, orderBy: { order: "asc" } } }
    });
  }

  private async recalculateDuration(playlistId: string): Promise<void> {
    const aggregate = await prisma.playlistItem.aggregate({
      where: { playlistId },
      _sum: { durationSeconds: true }
    });
    await prisma.playlist.update({
      where: { id: playlistId },
      data: { durationSeconds: aggregate._sum.durationSeconds ?? 0 }
    });
  }
}
