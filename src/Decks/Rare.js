import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Rare extends Card {
  #category = CardCategory.EVENT;
  #effect;
  #durationInRounds;

  constructor(id, name, description, effect, durationInRounds) {
    super(id, name, description);

    this.#effect = effect;
    this.#durationInRounds = durationInRounds;
  }
}
