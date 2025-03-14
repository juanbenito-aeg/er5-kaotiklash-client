import { globals } from "../index.js";

export default class Turn {
  #phases;
  #numOfExceccutePhase;
  #deckContainer;
  #board;
  #mouseInput;

  constructor(phases, deckContainer, board, mouseInput, player) {
    this.#phases = phases;
    this.#numOfExceccutePhase = 0;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.player = player;
  }

  create() {
    if (this.#phases.length > 0) {
      this.execute();
    }
  }

  execute() {
    if (this.#numOfExceccutePhase < this.#phases.length) {
      const currentPhase = this.#phases[this.#numOfExceccutePhase];
    }

    currentPhase.execute();

    this.#numOfExceccutePhase++;

    if (this.#numOfExceccutePhase === this.#phases.length) {
      globals.isFinished = true;
      this.changeTurn(this.player);
    }
  }

  changeTurn(player) {
    if (globals.isFinished) {
      globals.isFinished = false;
      this.#numOfExceccutePhase = 0;
      return true;
    }
    return false;
  }
}
