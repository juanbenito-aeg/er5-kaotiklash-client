export default class Deck {
  #deckType;
  #cards;

  constructor(deckType, cards) {
    this.#deckType = deckType;
    this.#cards = cards;
  }

  getDeckType() {
    return this.#deckType;
  }

  getCards() {
    return this.#cards;
  }

  insertCard(card) {
    this.#cards.push(card);
  }
}
