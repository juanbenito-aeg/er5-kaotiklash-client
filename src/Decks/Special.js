import Card from "./Card.js";

export default class Special extends Card {
  #effect;
  #intialDurationInRounds;
  #currentDurationInRounds;
  #initialPrepTimeInRounds;
  #currentPrepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    effect,
    initialDurationInRounds,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#effect = effect;
    this.#intialDurationInRounds = this.#currentDurationInRounds =
      initialDurationInRounds;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getCurrentDurationInRounds() {
    return this.#currentDurationInRounds;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }
}
