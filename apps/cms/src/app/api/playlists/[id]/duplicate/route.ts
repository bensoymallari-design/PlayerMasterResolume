import { NextRequest } from "next/server";
import { created, fail } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlaylistService } from "@/server/services/playlist-service";

const service = new PlaylistService();

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const { id } = await params;
    return created(await service.duplicate(id));
  } catch (error) {
    return fail(error);
  }
}
