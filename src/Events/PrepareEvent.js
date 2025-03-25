import Event from "./Event.js";

export default class PrepareEvent extends Event {
  #preparationEventDeck;
  #eventIsActive;
  constructor(preparationEventDeck) {
    super();
    this.#preparationEventDeck = preparationEventDeck;
    this.#eventIsActive = true;
  }

  static create(preparationEventDeck) {
    return new PrepareEvent(preparationEventDeck);
  }

  execute() {
    const cards = this.#preparationEventDeck.getCards();
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      let remainingTime = card.getCurrentPrepTimeInRounds();
      let newRemainingTime = remainingTime - 1;

      if (remainingTime > 0) {
        card.setCurrenPrepTimeInRounds(newRemainingTime);
      }

      if (newRemainingTime === 0) {
        console.log("aaaaaa");
      }
    }
    if (cards.length === 0) {
      this.#eventIsActive = false;
    }
  }

  isActive() {
    return this.#eventIsActive;
  }
}
