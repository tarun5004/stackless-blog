/**
 * GET  /api/topics — list all topics.
 * POST /api/topics — create a new topic.
 */

import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getTopics, createTopic } from "@/db/queries/topics";

export async function GET() {
  const topics = await getTopics();
  return NextResponse.json(topics);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const topic = await createTopic(body);
    return NextResponse.json(topic, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create topic";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
