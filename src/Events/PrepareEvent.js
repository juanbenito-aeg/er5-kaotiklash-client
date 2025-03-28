import Event from "./Event.js";

export default class PrepareEvent extends Event {
  #preparationEventDeck;
  #eventIsActive;
  #executedByPlayer;
  #currentState;
  #lastPlayer;

  constructor(preparationEventDeck, executedByPlayer) {
    super();
    this.#preparationEventDeck = preparationEventDeck;
    this.#eventIsActive = true;
    this.#executedByPlayer = executedByPlayer;
    this.#currentState = "UNINITIALIZED";
    this.#lastPlayer = null;
  }

  static create(preparationEventDeck, executedByPlayer) {
    return new PrepareEvent(preparationEventDeck, executedByPlayer);
  }

  execute(currentPlayer) {
    // INITIALIZE WHEN IT'S THE EXECUTING PLAYER'S TURN
    switch (this.#currentState) {
      case "UNINITIALIZED":
        if (currentPlayer === this.#executedByPlayer) {
          this.#currentState = "INITIALIZED";
          this.#lastPlayer = currentPlayer;
        }
        break;

      case "INITIALIZED":
        // ONLY ACT ON PLAYER CHANGE
        if (currentPlayer !== this.#lastPlayer) {
          console.log("hey");

          // REDUCE TIME WHEN RETURNING TO EXECUTING PLAYER FROM OTHER PLAYER
          if (
            currentPlayer !== this.#executedByPlayer &&
            this.#lastPlayer === this.#executedByPlayer
          ) {
            console.log(currentPlayer);
            console.log("mamaamamam");
            this.#reducePreparationTime();
          }
          this.#lastPlayer = currentPlayer; // UPDATE LAST PLAYER
        }
        break;
    }

    return false;
  }

  #reducePreparationTime() {
    console.log("time--");
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

    if (!reductionOccurred) {
      console.log("NO CARDS TO REDUCE");
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
