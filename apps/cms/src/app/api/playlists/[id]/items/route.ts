import { NextRequest } from "next/server";
import { created, fail } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlaylistService } from "@/server/services/playlist-service";

const service = new PlaylistService();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const { id } = await params;
    const body = (await request.json()) as {
      mediaId: string;
      durationSeconds?: number;
      transition?: string;
    };
    return created(await service.addItem({ playlistId: id, ...body }));
  } catch (error) {
    return fail(error);
  }
}
