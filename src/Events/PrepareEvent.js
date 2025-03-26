import Event from "./Event.js";

export default class PrepareEvent extends Event {
  #preparationEventDeck;
  #eventIsActive;
  #executedByPlayer;

  constructor(preparationEventDeck, executedByPlayer) {
    super();
    this.#preparationEventDeck = preparationEventDeck;
    this.#eventIsActive = true;
    this.#executedByPlayer = executedByPlayer;
  }

  static create(preparationEventDeck, executedByPlayer) {
    return new PrepareEvent(preparationEventDeck, executedByPlayer);
  }

  execute(currentPlayer) {
    const cards = this.#preparationEventDeck.getCards();
    if (currentPlayer === this.#executedByPlayer) {
      for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let remainingTime = card.getCurrentPrepTimeInRounds();
        let newRemainingTime = remainingTime - 1;

        if (remainingTime > 0) {
          card.setCurrenPrepTimeInRounds(newRemainingTime);
        }

        if (newRemainingTime === 0) {
          console.log("aaaaaa");
          this.#eventIsActive = false;
        }
      }
    }
  }

  isActive() {
    return this.#eventIsActive;
  }
}
