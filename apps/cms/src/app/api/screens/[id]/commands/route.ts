import { NextRequest } from "next/server";
import type { PlayerCommandKind } from "@playermaster/shared";
import { created, fail } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlayerCommandService } from "@/server/services/player-command-service";

const service = new PlayerCommandService();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const { id } = await params;
    const body = (await request.json()) as {
      kind: PlayerCommandKind;
      payload?: Record<string, unknown>;
    };
    return created(
      await service.issue({
        screenId: id,
        kind: body.kind,
        payload: body.payload,
        issuedById: session.id
      })
    );
  } catch (error) {
    return fail(error);
  }
}
