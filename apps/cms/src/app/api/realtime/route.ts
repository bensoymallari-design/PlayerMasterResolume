import { ok } from "@/lib/api";
import { getRealtimeServer } from "@/lib/realtime";

export async function GET() {
  const realtime = getRealtimeServer();
  return ok({
    status: "ready",
    clients: realtime.io.engine.clientsCount
  });
}
