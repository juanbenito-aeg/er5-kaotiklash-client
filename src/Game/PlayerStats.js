export default class PlayerStats {
  #minionsKilled;
  #fumbles;
  #criticalHits;
  #usedCards;

  constructor() {
    this.#minionsKilled = 0;
    this.#fumbles = 0;
    this.#criticalHits = 0;
    this.#usedCards = 3;
  }

  incrementMinionsKilled() {
    this.#minionsKilled++;
  }

  incrementFumbles() {
    this.#fumbles++;
  }

  incrementCriticalHits() {
    this.#criticalHits++;
  }

  incrementUsedCards() {
    this.#usedCards++;
  }
}
