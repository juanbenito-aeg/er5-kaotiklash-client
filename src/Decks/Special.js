import Card from "./Card.js";

export default class Special extends Card {
  #effect;
  #durationInRounds;
  #prepTimeInRounds;

  constructor(
    id,
    name,
    description,
    effect,
    durationInRounds,
    prepTimeInRounds
  ) {
    super(id, name, description);

    this.#effect = effect;
    this.#durationInRounds = durationInRounds;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
