import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { ContentManifestService } from "@/server/services/content-manifest-service";

const service = new ContentManifestService();

export async function GET(_request: NextRequest, { params }: { params: Promise<{ screenId: string }> }) {
  try {
    const { screenId } = await params;
    return ok(await service.buildForScreen(screenId));
  } catch (error) {
    return fail(error);
  }
}
