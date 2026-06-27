import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MediaKind } from "@playermaster/shared";
import { prisma } from "@/lib/prisma";

const uploadRoot = process.env.MEDIA_UPLOAD_DIR ?? path.join(process.cwd(), "storage", "media");

export class MediaService {
  async list(params: { query?: string; category?: string; tag?: string }) {
    return prisma.media.findMany({
      where: {
        AND: [
          params.query
            ? {
                OR: [
                  { title: { contains: params.query, mode: "insensitive" } },
                  { fileName: { contains: params.query, mode: "insensitive" } }
                ]
              }
            : {},
          params.category ? { category: params.category } : {},
          params.tag ? { tags: { has: params.tag } } : {}
        ]
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async createExternal(input: {
    title: string;
    kind: MediaKind;
    externalUrl: string;
    category?: string;
    tags?: string[];
    durationSeconds?: number;
    createdById?: string;
  }) {
    return prisma.media.create({
      data: {
        title: input.title,
        kind: input.kind,
        mimeType: externalMime(input.kind),
        externalUrl: input.externalUrl,
        category: input.category,
        tags: input.tags ?? [],
        durationSeconds: input.durationSeconds,
        createdById: input.createdById
      }
    });
  }

  async upload(input: {
    file: File;
    title?: string;
    kind: MediaKind;
    category?: string;
    tags?: string[];
    createdById?: string;
  }) {
    await mkdir(uploadRoot, { recursive: true });
    const bytes = Buffer.from(await input.file.arrayBuffer());
    const checksum = crypto.createHash("sha256").update(bytes).digest("hex");
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedName = `${checksum.slice(0, 16)}-${safeName}`;
    const storagePath = path.join(uploadRoot, storedName);

    await writeFile(storagePath, bytes);

    return prisma.media.create({
      data: {
        title: input.title ?? input.file.name,
        kind: input.kind,
        mimeType: input.file.type || externalMime(input.kind),
        fileName: input.file.name,
        storagePath,
        checksum,
        sizeBytes: BigInt(bytes.byteLength),
        category: input.category,
        tags: input.tags ?? [],
        createdById: input.createdById
      }
    });
  }

  async delete(id: string) {
    return prisma.media.delete({ where: { id } });
  }
}

function externalMime(kind: MediaKind): string {
  switch (kind) {
    case "WEBSITE":
    case "YOUTUBE":
    case "LIVE_STREAM":
    case "NDI":
      return "text/uri-list";
    case "HTML_WIDGET":
      return "text/html";
    case "GIF":
      return "image/gif";
    case "IMAGE":
      return "image/*";
    case "VIDEO":
    default:
      return "video/mp4";
  }
}
