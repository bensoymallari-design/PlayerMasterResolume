import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireSession();
    return ok(
      await prisma.screen.findMany({
        include: { playlist: true, layout: true },
        orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
      })
    );
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "MANAGER"]);
    const body = (await request.json()) as { name: string; monitorCount?: number };
    return created(
      await prisma.screen.create({
        data: {
          name: body.name,
          monitorCount: body.monitorCount ?? 1,
          registrationCode: crypto.randomBytes(4).toString("hex").toUpperCase()
        }
      })
    );
  } catch (error) {
    return fail(error);
  }
}
