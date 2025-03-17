import Phase from "./Phase.js";
import { BoxState, CardState } from "../Game/constants.js";

export default class PerformEventPhase extends Phase {
  // #eventsPreparationDeck;
  // #eventsPreparationGrid;
  // #activeEventsDeck;
  // #currentPlayerMovementGridDeck;
  // #enemyMovementGridDeck;
  // #state;

  constructor(
    /* eventsPreparationDeck,
    eventsPreparationGrid,
    activeEventsDeck,
    currentPlayerMovementGridDeck,
    enemyMovementGridDeck */

    state,
    deckContainer,
    board,
    mouseInput
  ) {
    // this.#eventsPreparationDeck = eventsPreparationDeck;
    // this.#eventsPreparationGrid = eventsPreparationGrid;
    // this.#activeEventsDeck = activeEventsDeck;
    // this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
    // this.#enemyMovementGridDeck = enemyMovementGridDeck;

    super(state, deckContainer, board, mouseInput);
  }

  execute() {
    // TODO
  }
}
