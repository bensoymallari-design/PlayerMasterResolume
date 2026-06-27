import { NextRequest } from "next/server";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { PlaylistService } from "@/server/services/playlist-service";

const service = new PlaylistService();

export async function GET() {
  try {
    await requireSession();
    return ok(await service.list());
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const body = (await request.json()) as { name: string; description?: string };
    return created(await service.create(body));
  } catch (error) {
    return fail(error);
  }
}
