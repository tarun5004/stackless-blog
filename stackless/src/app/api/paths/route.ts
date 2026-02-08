/**
 * GET  /api/paths — list all learning paths.
 * POST /api/paths — create a new learning path.
 */

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getPaths, createPath } from "@/db/queries/paths";

export async function GET() {
  const paths = await getPaths();
  return NextResponse.json(paths);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "title and slug are required" },
        { status: 400 }
      );
    }

    const path = await createPath(body);
    return NextResponse.json(path, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create path";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
