import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Special extends Card {
  #category = CardCategory.SPECIAL;
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
