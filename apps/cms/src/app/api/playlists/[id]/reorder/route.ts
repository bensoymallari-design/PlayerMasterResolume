import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlaylistService } from "@/server/services/playlist-service";

const service = new PlaylistService();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const { id } = await params;
    const body = (await request.json()) as { orderedItemIds: string[] };
    return ok(await service.reorder(id, body.orderedItemIds));
  } catch (error) {
    return fail(error);
  }
}
