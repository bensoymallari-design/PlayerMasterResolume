import { app, BrowserWindow } from "electron";
import { rm } from "node:fs/promises";
import path from "node:path";
import type { PlayerCommand } from "@playermaster/shared";

export class PlayerCommandService {
  constructor(private readonly window: BrowserWindow) {}

  async handle(command: PlayerCommand): Promise<void> {
    switch (command.kind) {
      case "RESTART_PLAYER":
        app.relaunch();
        app.exit(0);
        break;
      case "REFRESH_CONTENT":
      case "CHANGE_PLAYLIST":
        this.window.webContents.send("player:refresh-content", command.payload ?? {});
        break;
      case "CLEAR_CACHE":
        await rm(path.join(app.getPath("userData"), "media-cache"), { recursive: true, force: true });
        this.window.webContents.send("player:refresh-content", {});
        break;
      case "SCREENSHOT_DEVICE":
        this.window.webContents.send("player:capture-screenshot", command.id);
        break;
      case "REBOOT_DEVICE":
        this.window.webContents.send("player:reboot-requested");
        break;
      default:
        command.kind satisfies never;
    }
  }
}
