import cardsJson from "@/data/bootstrap/cards.en.json";
import type { Card } from "@/types/domain";

export function loadBootstrapCards(): Card[] {
  return cardsJson as Card[];
}
