import { contextBridge, ipcRenderer } from "electron";
import type { ContentManifest } from "@playermaster/shared";

contextBridge.exposeInMainWorld("playerMaster", {
  onManifest(callback: (manifest: ContentManifest) => void) {
    ipcRenderer.on("content:manifest", (_event, manifest: ContentManifest) => callback(manifest));
  },
  onRefreshContent(callback: () => void) {
    ipcRenderer.on("player:refresh-content", () => callback());
  },
  listDisplays() {
    return ipcRenderer.invoke("display:list");
  }
});

declare global {
  interface Window {
    playerMaster: {
      onManifest(callback: (manifest: ContentManifest) => void): void;
      onRefreshContent(callback: () => void): void;
      listDisplays(): Promise<unknown[]>;
    };
  }
}
