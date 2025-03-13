import Card from "./Card.js";

export default class Rare extends Card {
  #effect;
  #durationInRounds;

  constructor(id, name, description, effect, durationInRounds) {
    super(id, name, description);

    this.#effect = effect;
    this.#durationInRounds = durationInRounds;
  }
}
