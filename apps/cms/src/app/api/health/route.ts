import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    service: "playermaster-cms",
    status: "ok",
    timestamp: new Date().toISOString()
  });
}
