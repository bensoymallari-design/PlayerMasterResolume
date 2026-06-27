import { app, BrowserWindow, ipcMain, powerSaveBlocker, screen } from "electron";
import { autoUpdater } from "electron-updater";
import { io } from "socket.io-client";
import path from "node:path";
import { ContentSyncService } from "@/main/services/content-sync-service";
import { PlayerCommandService } from "@/main/services/player-command-service";
import { SettingsService } from "@/main/services/settings-service";
import { TelemetryService } from "@/main/services/telemetry-service";

let mainWindow: BrowserWindow | undefined;

async function createWindow(): Promise<void> {
  const primaryDisplay = screen.getPrimaryDisplay();
  mainWindow = new BrowserWindow({
    x: primaryDisplay.bounds.x,
    y: primaryDisplay.bounds.y,
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    backgroundColor: "#020617",
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      backgroundThrottling: false
    }
  });

  powerSaveBlocker.start("prevent-display-sleep");
  await mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  const settingsService = new SettingsService();
  const syncService = new ContentSyncService();
  const telemetryService = new TelemetryService();
  const commandService = new PlayerCommandService(mainWindow);
  const settings = await settingsService.load();

  if (settings.registrationCode && !settings.screenId) {
    const response = await fetch(`${settings.cmsUrl}/api/player/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        registrationCode: settings.registrationCode,
        deviceFingerprint: settings.deviceFingerprint,
        appVersion: app.getVersion(),
        osVersion: process.platform,
        monitorCount: screen.getAllDisplays().length
      })
    });
    if (response.ok) {
      const payload = (await response.json()) as { data: { screenId: string } };
      settings.screenId = payload.data.screenId;
      await settingsService.save(settings);
    }
  }

  if (settings.screenId) {
    const manifest = await syncService.sync(settings.cmsUrl, settings.screenId);
    mainWindow.webContents.send("content:manifest", manifest);

    const socket = io(settings.cmsUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 15000
    });

    socket.on("connect", () => {
      socket.emit("screen:join", { screenId: settings.screenId });
    });

    socket.on("content:update", async () => {
      const nextManifest = await syncService.sync(settings.cmsUrl, settings.screenId!);
      mainWindow?.webContents.send("content:manifest", nextManifest);
    });

    socket.on("player:command", async (command) => {
      await commandService.handle(command);
      socket.emit("screen:command:ack", { commandId: command.id });
    });

    setInterval(async () => {
      socket.emit("screen:heartbeat", {
        screenId: settings.screenId,
        status: "ONLINE",
        telemetry: await telemetryService.collect(),
        timestamp: new Date().toISOString()
      });
    }, 30_000);
  }

  autoUpdater.checkForUpdatesAndNotify().catch(() => undefined);
}

app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("ignore-gpu-blocklist");

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("display:list", () => screen.getAllDisplays());
