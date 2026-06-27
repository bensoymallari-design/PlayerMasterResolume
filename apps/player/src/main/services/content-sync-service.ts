import { app } from "electron";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentManifest, MediaAsset } from "@playermaster/shared";

export class ContentSyncService {
  private readonly manifestPath = path.join(app.getPath("userData"), "manifest.json");
  private readonly cacheDir = path.join(app.getPath("userData"), "media-cache");

  async sync(cmsUrl: string, screenId: string): Promise<ContentManifest> {
    const response = await fetch(`${cmsUrl}/api/player/${screenId}/manifest`, {
      cache: "no-store"
    });
    if (!response.ok) {
      return this.loadCachedManifest();
    }

    const payload = (await response.json()) as { data: ContentManifest };
    await this.cacheManifest(payload.data);
    await this.cacheMedia(payload.data.media);
    return payload.data;
  }

  async loadCachedManifest(): Promise<ContentManifest> {
    return JSON.parse(await readFile(this.manifestPath, "utf8")) as ContentManifest;
  }

  private async cacheManifest(manifest: ContentManifest): Promise<void> {
    await mkdir(path.dirname(this.manifestPath), { recursive: true });
    await writeFile(this.manifestPath, JSON.stringify(manifest, null, 2));
  }

  private async cacheMedia(media: MediaAsset[]): Promise<void> {
    await mkdir(this.cacheDir, { recursive: true });
    await Promise.all(
      media
        .filter((asset) => asset.externalUrl && asset.kind !== "WEBSITE" && asset.kind !== "YOUTUBE")
        .map(async (asset) => {
          const response = await fetch(asset.externalUrl!);
          if (!response.ok) {
            return;
          }
          const bytes = Buffer.from(await response.arrayBuffer());
          const target = path.join(this.cacheDir, asset.fileName ?? `${asset.id}.bin`);
          await writeFile(target, bytes);
        })
    );
  }
}
