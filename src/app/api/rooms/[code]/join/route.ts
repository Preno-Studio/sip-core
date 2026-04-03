import { NextResponse } from "next/server";
import { assertRateLimit } from "@/lib/server/rate-limit";
import { requestClientKey } from "@/lib/server/request";
import { joinRoom } from "@/lib/server/store";
import { joinRoomSchema } from "@/lib/schemas/room";

interface RouteContext {
  params: Promise<{
    code: string;
  }>;
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const clientKey = await requestClientKey();
    const { code } = await context.params;

    assertRateLimit({
      key: `join-room:${code}:${clientKey}`,
      limit: 10,
      windowMs: 60_000
    });

    const json = await request.json().catch(() => ({}));
    const payload = joinRoomSchema.parse(json);
    const room = joinRoom(code, payload.name);

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to join room.";
    const status = message.includes("Rate limit") ? 429 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
