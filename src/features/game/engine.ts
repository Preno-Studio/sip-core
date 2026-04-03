import type { Card, GameRoom, Round } from "@/types/domain";

export interface NextCardInput {
  cards: Card[];
  room: GameRoom;
  random: () => number;
}

const HIGH_INTENSITY = 4;
const MAX_HIGH_STREAK = 2;

function isRoomCompatible(card: Card, playerCount: number): boolean {
  return card.minPlayers <= playerCount && card.maxPlayers >= playerCount;
}

function buildIntensityStreak(rounds: Round[], cardById: Map<string, Card>): number {
  let streak = 0;

  for (let i = rounds.length - 1; i >= 0; i -= 1) {
    const card = cardById.get(rounds[i].cardId);
    if (!card || card.difficulty < HIGH_INTENSITY) {
      break;
    }
    streak += 1;
  }

  return streak;
}

export function selectNextCard(input: NextCardInput): Card {
  const { cards, room, random } = input;
  const playerCount = room.players.length;

  const approved = cards.filter(
    (card) =>
      card.isActive &&
      card.moderationStatus === "approved" &&
      isRoomCompatible(card, playerCount) &&
      !room.usedCardIds.includes(card.id)
  );

  const pool = approved.length > 0
    ? approved
    : cards.filter(
        (card) =>
          card.isActive &&
          card.moderationStatus === "approved" &&
          isRoomCompatible(card, playerCount)
      );

  if (pool.length === 0) {
    throw new Error("No cards available for this room configuration.");
  }

  const cardById = new Map(cards.map((card) => [card.id, card]));
  const highStreak = buildIntensityStreak(room.rounds, cardById);
  const filteredByIntensity =
    highStreak >= MAX_HIGH_STREAK
      ? pool.filter((card) => card.difficulty < HIGH_INTENSITY)
      : pool;

  const finalPool = filteredByIntensity.length > 0 ? filteredByIntensity : pool;
  const selectedIndex = Math.floor(random() * finalPool.length);

  return finalPool[selectedIndex];
}

export function computeSipValue(baseSipValue: number, roundIndex: number): number {
  const progressionBonus = Math.floor(roundIndex / 4);
  return Math.max(1, baseSipValue + progressionBonus);
}
