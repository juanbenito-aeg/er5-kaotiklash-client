import Card from "./Card.js";

export default class MainCharacter extends Card {
  #specialSkill;

  constructor(id, name, description, specialSkill) {
    super(id, name, description);

    this.#specialSkill = specialSkill;
  }
}
