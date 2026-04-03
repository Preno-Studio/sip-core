import { NextResponse } from "next/server";
import { nextRound } from "@/lib/server/store";
import { assertRateLimit } from "@/lib/server/rate-limit";
import { requestClientKey } from "@/lib/server/request";

interface RouteContext {
  params: Promise<{
    code: string;
  }>;
}

export async function POST(_request: Request, context: RouteContext): Promise<Response> {
  try {
    const clientKey = await requestClientKey();
    const { code } = await context.params;

    assertRateLimit({
      key: `round-next:${code}:${clientKey}`,
      limit: 40,
      windowMs: 60_000
    });

    const result = nextRound(code);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to progress round.";
    const status = message.includes("Rate limit") ? 429 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
