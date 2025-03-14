export default class Card {
  #category;
  #id;
  #name;
  #description;

  constructor(id, name, description) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
  }

  getCategory() {
    return this.#category;
  }

  getID() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getDescription() {
    return this.#description;
  }
}
