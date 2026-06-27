import { NextRequest, NextResponse } from "next/server";
import { isAllowedLocalOrigin, isPrivateHostname, localNetworkOnlyEnabled } from "@/lib/local-network";

export function middleware(request: NextRequest): NextResponse {
  if (!localNetworkOnlyEnabled()) {
    return NextResponse.next();
  }

  const host = request.nextUrl.hostname;
  const origin = request.headers.get("origin") ?? undefined;

  if (!isPrivateHostname(host) || !isAllowedLocalOrigin(origin)) {
    return NextResponse.json(
      {
        error: {
          code: "LOCAL_NETWORK_ONLY",
          message: "PlayerMaster is configured for local network access only."
        }
      },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
