"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });

    setLoading(false);
    if (!response.ok) {
      setError("Invalid credentials or inactive account.");
      return;
    }

    router.push("/");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm">
        Email
        <input
          name="email"
          type="email"
          className="mt-2 w-full rounded-md border bg-background px-3 py-2"
          placeholder="admin@example.com"
          required
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          name="password"
          type="password"
          className="mt-2 w-full rounded-md border bg-background px-3 py-2"
          placeholder="password"
          required
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
