import Event from "./Event.js";
import { EventCooldownState } from "../Game/constants.js";

export default class PrepareEvent extends Event {
  #currentState;

  constructor(executedBy, eventCard) {
    super(executedBy, eventCard);

    this.#currentState = EventCooldownState.UNINITIALIZED;
  }

  static create(executedBy, eventCard) {
    return new PrepareEvent(executedBy, eventCard);
  }

  execute(currentPlayer) {
    // INITIALIZE WHEN IT'S THE EXECUTING PLAYER'S TURN
    switch (this.#currentState) {
      case EventCooldownState.UNINITIALIZED:
        if (currentPlayer === this._executedBy) {
          this.#currentState = EventCooldownState.INITIALIZED;
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
    let remainingTime = this._eventCard.getCurrentPrepTimeInRounds();

    if (remainingTime > 0) {
      this._eventCard.setCurrentPrepTimeInRounds(remainingTime - 1);
    }
  }

  isActive() {
    if (this._eventCard.getCurrentPrepTimeInRounds() > 0) {
      return true;
    }
  }
}
