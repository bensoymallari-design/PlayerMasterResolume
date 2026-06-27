import type { PlayerCommandKind } from "@playermaster/shared";
import { getRealtimeServer } from "@/lib/realtime";
import { prisma } from "@/lib/prisma";

export class PlayerCommandService {
  async issue(input: {
    screenId: string;
    kind: PlayerCommandKind;
    issuedById: string;
    payload?: Record<string, unknown>;
  }) {
    const command = await prisma.playerCommand.create({
      data: {
        screenId: input.screenId,
        kind: input.kind,
        issuedById: input.issuedById,
        payload: input.payload ?? {}
      }
    });

    getRealtimeServer().emitCommand({
      id: command.id,
      screenId: command.screenId,
      kind: command.kind,
      payload: command.payload as Record<string, unknown>,
      issuedAt: command.issuedAt.toISOString(),
      issuedBy: command.issuedById
    });

    await prisma.playerCommand.update({
      where: { id: command.id },
      data: { status: "SENT" }
    });

    return command;
  }
}
