import { NextRequest } from "next/server";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { SchedulingService } from "@/server/services/scheduling-service";

const service = new SchedulingService();

export async function GET() {
  try {
    await requireSession();
    return ok(await service.list());
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "MANAGER"]);
    return created(await service.create(await request.json()));
  } catch (error) {
    return fail(error);
  }
}
