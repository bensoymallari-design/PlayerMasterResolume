import { NextRequest } from "next/server";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { LayoutService } from "@/server/services/layout-service";

const service = new LayoutService();

export async function GET() {
  try {
    await requireSession();
    return ok(await service.listTemplates());
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    return created(await service.create(await request.json()));
  } catch (error) {
    return fail(error);
  }
}
