import type { PlayerHeartbeat, Screen } from "@playermaster/shared";
import { create } from "zustand";

interface MonitoringState {
  screens: Screen[];
  lastHeartbeat?: PlayerHeartbeat;
  setScreens: (screens: Screen[]) => void;
  applyHeartbeat: (heartbeat: PlayerHeartbeat) => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  screens: [],
  setScreens: (screens) => set({ screens }),
  applyHeartbeat: (heartbeat) =>
    set((state) => ({
      lastHeartbeat: heartbeat,
      screens: state.screens.map((screen) =>
        screen.id === heartbeat.screenId
          ? {
              ...screen,
              status: heartbeat.status,
              lastHeartbeatAt: heartbeat.timestamp,
              currentContent: heartbeat.currentContent,
              telemetry: heartbeat.telemetry
            }
          : screen
      )
    }))
}));
