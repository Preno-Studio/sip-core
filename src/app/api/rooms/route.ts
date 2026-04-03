import { NextResponse } from "next/server";
import { createRoom } from "@/lib/server/store";
import { assertRateLimit } from "@/lib/server/rate-limit";
import { requestClientKey } from "@/lib/server/request";
import { createRoomSchema } from "@/lib/schemas/room";

export async function POST(request: Request): Promise<Response> {
  try {
    const clientKey = await requestClientKey();
    assertRateLimit({
      key: `create-room:${clientKey}`,
      limit: 6,
      windowMs: 60_000
    });

    const json = await request.json().catch(() => ({}));
    const payload = createRoomSchema.parse(json);

    const room = createRoom(payload.hostName);
    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create room.";
    const status = message.includes("Rate limit") ? 429 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
