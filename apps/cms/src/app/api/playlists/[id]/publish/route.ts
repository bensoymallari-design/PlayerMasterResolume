import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlaylistService } from "@/server/services/playlist-service";

const service = new PlaylistService();

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession(["ADMIN", "MANAGER"]);
    const { id } = await params;
    return ok(await service.publish(id));
  } catch (error) {
    return fail(error);
  }
}
