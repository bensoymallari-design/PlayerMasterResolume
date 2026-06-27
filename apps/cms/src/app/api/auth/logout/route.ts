import { clearSessionCookie } from "@/lib/auth";
import { noContent } from "@/lib/api";

export async function POST() {
  await clearSessionCookie();
  return noContent();
}
