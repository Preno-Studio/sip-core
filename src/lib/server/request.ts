import { headers } from "next/headers";

export async function requestClientKey(): Promise<string> {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");

  const fromForwarded = forwardedFor?.split(",")[0]?.trim();

  return fromForwarded || realIp || "anonymous-client";
}
