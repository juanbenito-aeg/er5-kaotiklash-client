import Event from "./Event.js";
import { EventCooldownState } from "../Game/constants.js";

export default class PrepareEvent extends Event {
  #preparationEventDeck;
  #currentState;

  constructor(executedBy, preparationEventDeck) {
    super(executedBy);

    this.#preparationEventDeck = preparationEventDeck;
    this.#currentState = EventCooldownState.UNINITIALIZED;
  }

  static create(executedBy, preparationEventDeck) {
    return new PrepareEvent(executedBy, preparationEventDeck);
  }

  execute(currentPlayer) {
    // INITIALIZE WHEN IT'S THE EXECUTING PLAYER'S TURN
    switch (this.#currentState) {
      case EventCooldownState.UNINITIALIZED:
        if (currentPlayer === this._executedBy) {
          this.#currentState = EventCooldownState.INITIALIZED;
          this._lastPlayer = currentPlayer;
        }
        break;

      case EventCooldownState.INITIALIZED:
        // ONLY ACT ON PLAYER CHANGE
        if (currentPlayer !== this._lastPlayer) {
          // REDUCE TIME WHEN RETURNING TO EXECUTING PLAYER FROM OTHER PLAYER
          if (
            currentPlayer === this._executedBy &&
            this._lastPlayer !== this._executedBy
          ) {
            this.#reducePreparationTime();
          }
          this._lastPlayer = currentPlayer; // UPDATE LAST PLAYER
        }
        break;
    }

    return false;
  }

  #reducePreparationTime() {
    let cards = this.#preparationEventDeck.getCards();
    let reductionOccurred = false;

    for (let i = 0; i < cards.length; i++) {
      let remainingTime = cards[i].getCurrentPrepTimeInRounds();

      if (remainingTime > 0) {
        cards[i].setCurrentPrepTimeInRounds(remainingTime - 1);
        reductionOccurred = true;
        break;
      }
    }
  }

  isActive() {
    let cards = this.#preparationEventDeck.getCards();

    for (let i = 0; i < cards.length; i++) {
      if (cards[i].getCurrentPrepTimeInRounds() > 0) {
        return true;
      }
    }

    return false;
  }
}
