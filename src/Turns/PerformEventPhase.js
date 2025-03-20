import Phase from "./Phase.js";

export default class PerformEventPhase extends Phase {
  #eventsPreparationDeck;
  #eventsPreparationGrid;
  #activeEventsDeck;
  #currentPlayerMovementGridDeck;
  #enemyMovementGridDeck;
  #state;

  constructor(
    eventsPreparationDeck,
    eventsPreparationGrid,
    activeEventsDeck,
    currentPlayerMovementGridDeck,
    enemyMovementGridDeck
  ) {
    super();
    
    this.#eventsPreparationDeck = eventsPreparationDeck;
    this.#eventsPreparationGrid = eventsPreparationGrid;
    this.#activeEventsDeck = activeEventsDeck;
    this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
    this.#enemyMovementGridDeck = enemyMovementGridDeck;
  }

  execute() {
    // TODO
  }
}
