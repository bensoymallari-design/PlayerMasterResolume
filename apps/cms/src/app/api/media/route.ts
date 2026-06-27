import { NextRequest } from "next/server";
import type { MediaKind } from "@playermaster/shared";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { MediaService } from "@/server/services/media-service";

const service = new MediaService();

export async function GET(request: NextRequest) {
  try {
    await requireSession();
    const searchParams = request.nextUrl.searchParams;
    return ok(
      await service.list({
        query: searchParams.get("q") ?? undefined,
        category: searchParams.get("category") ?? undefined,
        tag: searchParams.get("tag") ?? undefined
      })
    );
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        throw Object.assign(new Error("File is required"), { status: 400 });
      }

      return created(
        await service.upload({
          file,
          title: form.get("title")?.toString(),
          kind: (form.get("kind")?.toString() ?? "VIDEO") as MediaKind,
          category: form.get("category")?.toString(),
          tags: form.get("tags")?.toString().split(",").filter(Boolean),
          createdById: session.id
        })
      );
    }

    const body = (await request.json()) as {
      title: string;
      kind: MediaKind;
      externalUrl: string;
      category?: string;
      tags?: string[];
      durationSeconds?: number;
    };
    return created(await service.createExternal({ ...body, createdById: session.id }));
  } catch (error) {
    return fail(error);
  }
}
