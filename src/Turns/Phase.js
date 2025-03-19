export default class Phase {
  #state;
  #deckContainer;
  #board;
  #mouseInput;
  #decksRelevantToPhase;
  #gridsRelevantToPhase;

  constructor(state, deckContainer, board, mouseInput) {
    this.#state = state;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.#decksRelevantToPhase = [];
    this.#gridsRelevantToPhase = [];
  }

  execute() {}

  addDeck(newDeck) {
    this.#decksRelevantToPhase.push(newDeck);
  }

  addGrid(newGrid) {
    this.#gridsRelevantToPhase.push(newGrid);
  }
}
