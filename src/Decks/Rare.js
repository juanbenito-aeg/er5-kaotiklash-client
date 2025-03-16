import Card from "./Card.js";

export default class Rare extends Card {
  #effect;
  #durationInRounds;

  constructor(category, id, name, description, effect, durationInRounds) {
    super(category, id, name, description);

    this.#effect = effect;
    this.#durationInRounds = durationInRounds;
  }
}
