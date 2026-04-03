import { computeSipValue, selectNextCard } from "@/features/game/engine";
import { loadBootstrapCards } from "@/lib/server/bootstrap";
import type { Card, GameRoom, NextRoundResult, Player, Round } from "@/types/domain";

const cards = loadBootstrapCards();
const rooms = new Map<string, GameRoom>();

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function randomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export function createRoom(hostName?: string): GameRoom {
  let code = randomCode();
  while (rooms.has(code)) {
    code = randomCode();
  }

  const hostPlayer: Player = {
    id: randomId("player"),
    name: hostName?.trim() || "Host",
    joinedAt: nowIso()
  };

  const room: GameRoom = {
    code,
    hostPlayerId: hostPlayer.id,
    createdAt: nowIso(),
    startedAt: null,
    players: [hostPlayer],
    rounds: [],
    usedCardIds: [],
    status: "lobby"
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): GameRoom | null {
  return rooms.get(code.toUpperCase()) ?? null;
}

export function joinRoom(code: string, requestedName?: string): GameRoom {
  const room = getRoom(code);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.players.length >= 10) {
    throw new Error("Room is full.");
  }

  const normalizedName = requestedName?.trim();
  const fallbackName = `Player ${room.players.length + 1}`;

  const nextPlayer: Player = {
    id: randomId("player"),
    name: normalizedName || fallbackName,
    joinedAt: nowIso()
  };

  room.players.push(nextPlayer);
  return room;
}

export function startRoom(code: string): GameRoom {
  const room = getRoom(code);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.players.length < 2) {
    throw new Error("At least 2 players are required.");
  }

  room.status = "active";
  room.startedAt = room.startedAt ?? nowIso();
  return room;
}

export function nextRound(code: string): NextRoundResult {
  const room = getRoom(code);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.status !== "active") {
    throw new Error("Room is not active.");
  }

  const selectedCard = selectNextCard({
    cards,
    room,
    random: Math.random
  });

  const roundIndex = room.rounds.length + 1;
  const round: Round = {
    index: roundIndex,
    cardId: selectedCard.id,
    skipped: false,
    createdAt: nowIso()
  };

  room.rounds.push(round);
  room.usedCardIds.push(selectedCard.id);

  const card: Card = {
    ...selectedCard,
    sipValue: computeSipValue(selectedCard.sipValue, roundIndex)
  };

  return { room, round, card };
}

export function skipRound(code: string): GameRoom {
  const room = getRoom(code);
  if (!room) {
    throw new Error("Room not found.");
  }

  if (room.status !== "active") {
    throw new Error("Room is not active.");
  }

  const latest = room.rounds[room.rounds.length - 1];

  if (!latest) {
    const placeholder: Round = {
      index: 1,
      cardId: "",
      skipped: true,
      createdAt: nowIso()
    };
    room.rounds.push(placeholder);
    return room;
  }

  latest.skipped = true;
  return room;
}
