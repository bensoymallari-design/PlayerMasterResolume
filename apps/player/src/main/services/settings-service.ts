import { app } from "electron";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface PlayerSettings {
  cmsUrl: string;
  screenId?: string;
  registrationCode?: string;
  deviceFingerprint: string;
}

export class SettingsService {
  private readonly filePath = path.join(app.getPath("userData"), "settings.json");

  async load(): Promise<PlayerSettings> {
    try {
      return JSON.parse(await readFile(this.filePath, "utf8")) as PlayerSettings;
    } catch {
      return {
        cmsUrl: process.env.PLAYERMASTER_CMS_URL ?? "http://localhost:3000",
        registrationCode: process.env.PLAYERMASTER_REGISTRATION_CODE,
        deviceFingerprint: `${process.platform}-${app.getPath("userData")}`
      };
    }
  }

  async save(settings: PlayerSettings): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(settings, null, 2));
  }
}
