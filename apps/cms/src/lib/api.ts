import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T): NextResponse {
  return ok(data, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function fail(error: unknown): NextResponse {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status: number }).status)
      : 500;
  const message = error instanceof Error ? error.message : "Unexpected server error";

  return NextResponse.json(
    {
      error: {
        code: status === 500 ? "INTERNAL_SERVER_ERROR" : message.toUpperCase().replaceAll(" ", "_"),
        message
      }
    },
    { status }
  );
}
