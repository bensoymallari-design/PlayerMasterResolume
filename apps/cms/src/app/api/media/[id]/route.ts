import { NextRequest } from "next/server";
import { fail, noContent } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { MediaService } from "@/server/services/media-service";

const service = new MediaService();

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireSession(["ADMIN", "MANAGER"]);
    const { id } = await params;
    await service.delete(id);
    return noContent();
  } catch (error) {
    return fail(error);
  }
}
