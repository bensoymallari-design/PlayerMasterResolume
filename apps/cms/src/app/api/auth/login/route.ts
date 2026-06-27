import { NextRequest } from "next/server";
import { authenticate, setSessionCookie, signSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    if (!email || !password) {
      throw Object.assign(new Error("Email and password are required"), { status: 400 });
    }

    const user = await authenticate(email, password);
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    await setSessionCookie(signSession(user));
    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
