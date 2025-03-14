import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class MainCharacter extends Card {
  #category = CardCategory.MAIN_CHARACTER;
  #specialSkill;

  constructor(id, name, description, specialSkill) {
    super(id, name, description);

    this.#specialSkill = specialSkill;
  }
}
