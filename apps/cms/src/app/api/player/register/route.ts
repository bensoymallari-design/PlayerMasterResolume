import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      registrationCode: string;
      deviceFingerprint: string;
      appVersion?: string;
      osVersion?: string;
      monitorCount?: number;
    };
    const screen = await prisma.screen.update({
      where: { registrationCode: body.registrationCode },
      data: {
        deviceFingerprint: body.deviceFingerprint,
        appVersion: body.appVersion,
        osVersion: body.osVersion,
        monitorCount: body.monitorCount ?? 1,
        status: "ONLINE",
        lastHeartbeatAt: new Date()
      }
    });

    return ok({ screenId: screen.id });
  } catch (error) {
    return fail(Object.assign(error instanceof Error ? error : new Error("Registration failed"), { status: 400 }));
  }
}
