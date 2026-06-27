import os from "node:os";
import { statfs } from "node:fs/promises";
import type { ScreenTelemetry } from "@playermaster/shared";

export class TelemetryService {
  async collect(currentContent?: string): Promise<ScreenTelemetry> {
    const disk = await statfs(process.cwd());
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    return {
      cpuUsagePercent: os.loadavg()[0],
      ramUsagePercent: Math.round(((totalMemory - freeMemory) / totalMemory) * 100),
      diskUsagePercent: Math.round(((disk.blocks - disk.bfree) / disk.blocks) * 100),
      appVersion: process.env.npm_package_version,
      osVersion: `${os.type()} ${os.release()}`,
      playerUptimeSeconds: Math.round(process.uptime()),
      currentContent
    };
  }
}
