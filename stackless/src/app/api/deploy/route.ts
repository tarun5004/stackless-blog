/**
 * POST /api/deploy — trigger a Vercel rebuild.
 *
 * Calls the Vercel deploy hook URL stored in VERCEL_DEPLOY_HOOK_URL.
 * Protected by NextAuth (only authenticated admin can call).
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json(
      { error: "Deploy hook URL not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Vercel returned an error" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to call deploy hook" },
      { status: 502 }
    );
  }
}
