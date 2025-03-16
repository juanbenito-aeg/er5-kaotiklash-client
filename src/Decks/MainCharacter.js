import Card from "./Card.js";

export default class MainCharacter extends Card {
  #specialSkill;

  constructor(category, id, name, description, specialSkill) {
    super(category, id, name, description);

    this.#specialSkill = specialSkill;
  }
}
