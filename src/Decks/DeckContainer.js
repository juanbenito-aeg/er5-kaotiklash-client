export default class DeckContainer {
  #decks;

  constructor(decks) {
    this.#decks = decks;
  }

  getDecks() {
    return this.#decks;
  }
}
