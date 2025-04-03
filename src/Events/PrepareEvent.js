import Event from "./Event.js";
import { EventCooldownState } from "../Game/constants.js";

export default class PrepareEvent extends Event {
  #preparationEventDeck;
  #executedByPlayer;
  #currentState;
  #lastPlayer;

  constructor(preparationEventDeck, executedByPlayer) {
    super();

    this.#preparationEventDeck = preparationEventDeck;
    this.#executedByPlayer = executedByPlayer;
    this.#currentState = EventCooldownState.UNINITIALIZED;
    this.#lastPlayer = null;
  }

  static create(preparationEventDeck, executedByPlayer) {
    return new PrepareEvent(preparationEventDeck, executedByPlayer);
  }

  execute(currentPlayer) {
    // INITIALIZE WHEN IT'S THE EXECUTING PLAYER'S TURN
    switch (this.#currentState) {
      case EventCooldownState.UNINITIALIZED:
        if (currentPlayer === this.#executedByPlayer) {
          this.#currentState = EventCooldownState.INITIALIZED;
          this.#lastPlayer = currentPlayer;
        }
        break;

      case EventCooldownState.INITIALIZED:
        // ONLY ACT ON PLAYER CHANGE
        if (currentPlayer !== this.#lastPlayer) {
          // REDUCE TIME WHEN RETURNING TO EXECUTING PLAYER FROM OTHER PLAYER
          if (
            currentPlayer === this.#executedByPlayer &&
            this.#lastPlayer !== this.#executedByPlayer
          ) {
            this.#reducePreparationTime();
          }
          this.#lastPlayer = currentPlayer; // UPDATE LAST PLAYER
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
        cards[i].setCurrenPrepTimeInRounds(remainingTime - 1);
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
