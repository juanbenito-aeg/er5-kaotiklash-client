export default class CardMovement {
  #card;
  #state;

  constructor(card, state) {
    this.#card = card;
    this.#state = state;
  }

  getCategory() {
    return this.#card.getCategory();
  }

  getID() {
    return this.#card.getID();
  }

  getName() {
    return this.#card.getName();
  }

  getDescription() {
    return this.#card.getDescription();
  }

  getSpecialSkill() {
    return this.#card.getSpecialSkill();
  }

  getXCoordinate() {
    return this.#card.getXCoordinate();
  }

  getYCoordinate() {
    return this.#card.getYCoordinate();
  }

  getImageSet() {
    return this.#card.getImageSet();
  }

  getState() {
    return this.#state;
  }

  setState(newState) {
    this.#state = newState;
  }
}
