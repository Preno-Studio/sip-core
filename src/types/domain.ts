export type CardType = "question" | "challenge" | "event" | "joker";

export type ModerationStatus = "pending" | "approved" | "rejected";

export interface Card {
  id: string;
  text: string;
  type: CardType;
  category: string;
  difficulty: number;
  sipValue: number;
  minPlayers: number;
  maxPlayers: number;
  language: "en";
  isActive: boolean;
  moderationStatus: ModerationStatus;
  source: string;
}

export interface Player {
  id: string;
  name: string;
  joinedAt: string;
}

export interface Round {
  index: number;
  cardId: string;
  skipped: boolean;
  createdAt: string;
}

export interface GameRoom {
  code: string;
  hostPlayerId: string;
  createdAt: string;
  startedAt: string | null;
  players: Player[];
  rounds: Round[];
  usedCardIds: string[];
  status: "lobby" | "active";
}

export interface NextRoundResult {
  room: GameRoom;
  round: Round;
  card: Card;
}
