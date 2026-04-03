import { z } from "zod";

export const createRoomSchema = z.object({
  hostName: z.string().min(1).max(32).optional()
});

export const joinRoomSchema = z.object({
  name: z.string().min(1).max(32).optional()
});
