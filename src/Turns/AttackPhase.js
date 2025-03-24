import Phase from "./Phase.js";

export default class AttackPhase extends Phase {
  // #enemyMovementGridDeck;
  // #currentPlayerMovementGridDeck;
  // #enemyMovementGrid;
  // #currentPlayerMovementGrid;
 

  constructor(
    /* enemyMovementGridDeck,
    currentPLayerMovementGridDeck,
    enemyMovementGrid,
    currentPlayerMovementGrid */

    state,
    deckContainer,
    board,
    mouseInput
  ) {
    // this.#enemyMovementGridDeck = enemyMovementGridDeck;
    // this.#currentPlayerMovementGridDeck = currentPLayerMovementGridDeck;
    // this.#enemyMovementGrid = enemyMovementGrid;
    // this.#currentPlayerMovementGrid = currentPlayerMovementGrid;

    super(state, deckContainer, board, mouseInput);
  }

  execute() {
    console.log("paqueee")
 
    // TODO
  }
}
