import type { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { created, fail, ok } from "@/lib/api";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireSession();
    return ok(await prisma.widget.findMany({ orderBy: { updatedAt: "desc" } }));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession(["ADMIN", "MANAGER", "OPERATOR"]);
    const body = (await request.json()) as {
      name: string;
      kind: "CLOCK" | "WEATHER" | "NEWS" | "TEXT";
      config?: Record<string, unknown>;
    };
    return created(
      await prisma.widget.create({
        data: {
          name: body.name,
          kind: body.kind,
          config: (body.config ?? {}) as Prisma.InputJsonValue
        }
      })
    );
  } catch (error) {
    return fail(error);
  }
}
