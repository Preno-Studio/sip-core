import { describe, expect, it } from "vitest";
import { computeSipValue, selectNextCard } from "@/features/game/engine";
import type { Card, GameRoom } from "@/types/domain";

const cards: Card[] = [
  {
    id: "a",
    text: "A",
    type: "question",
    category: "icebreaker",
    difficulty: 4,
    sipValue: 2,
    minPlayers: 2,
    maxPlayers: 10,
    language: "en",
    isActive: true,
    moderationStatus: "approved",
    source: "test"
  },
  {
    id: "b",
    text: "B",
    type: "challenge",
    category: "performance",
    difficulty: 4,
    sipValue: 2,
    minPlayers: 2,
    maxPlayers: 10,
    language: "en",
    isActive: true,
    moderationStatus: "approved",
    source: "test"
  },
  {
    id: "c",
    text: "C",
    type: "question",
    category: "reflect",
    difficulty: 2,
    sipValue: 1,
    minPlayers: 2,
    maxPlayers: 10,
    language: "en",
    isActive: true,
    moderationStatus: "approved",
    source: "test"
  }
];

function roomWithRounds(roundCardIds: string[]): GameRoom {
  return {
    code: "ROOM01",
    hostPlayerId: "p1",
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    players: [
      { id: "p1", name: "Host", joinedAt: new Date().toISOString() },
      { id: "p2", name: "Guest", joinedAt: new Date().toISOString() }
    ],
    rounds: roundCardIds.map((id, index) => ({
      index: index + 1,
      cardId: id,
      skipped: false,
      createdAt: new Date().toISOString()
    })),
    usedCardIds: [],
    status: "active"
  };
}

describe("game engine", () => {
  it("avoids a third high-intensity card in a row when alternatives exist", () => {
    const room = roomWithRounds(["a", "b"]);

    const selected = selectNextCard({
      cards,
      room,
      random: () => 0
    });

    expect(selected.id).toBe("c");
  });

  it("increases sip value as rounds progress", () => {
    expect(computeSipValue(2, 1)).toBe(2);
    expect(computeSipValue(2, 4)).toBe(3);
    expect(computeSipValue(2, 9)).toBe(4);
  });
});
