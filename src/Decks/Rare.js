import Card from "./Card.js";

export default class Rare extends Card {
  #effect;
  #initialDurationInRounds;
  #currentDurationInRounds;

  constructor(
    category,
    id,
    name,
    description,
    effect,
    initialDurationInRounds
  ) {
    super(category, id, name, description);

    this.#effect = effect;
    this.#initialDurationInRounds = this.#currentDurationInRounds =
      initialDurationInRounds;
  }

  getEffect() {
    return this.#effect;
  }

  getInitialDurationInRounds() {
    return this.#initialDurationInRounds;
  }

  getCurrentDurationInRounds() {
    return this.#currentDurationInRounds;
  }
}
