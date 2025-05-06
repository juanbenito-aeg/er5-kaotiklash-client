export default class Player {
  #id;
  #name;
  #totalHP;
  #minions_killed;
  #fumbles;
  #critical_hits;
  #used_cards;

  constructor(id, name) {
    this.#id = id;
    this.#name = name;
    this.#minions_killed = 0;
    this.#fumbles = 0;
    this.#critical_hits = 0;
    this.#used_cards = 3;
  }

  getID() {
    return this.#id;
  }

  setID(newID) {
    this.#id = newID;
  }

  getName() {
    return this.#name;
  }

  getTotalHP() {
    return this.#totalHP;
  }

  setTotalHP(newTotalHP) {
    this.#totalHP = newTotalHP;
  }

  getMinionsKilled() {
    return this.#minions_killed;
  }

  getFumbles() {
    return this.#fumbles;
  }

  getCriticalHits() {
    return this.#critical_hits;
  }

  getUsedCards() {
    return this.#used_cards;
  }
}
