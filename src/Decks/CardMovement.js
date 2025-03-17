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

  getMinionType() {
    return this.#card.getMinionType();
  }

  getWeaponType() {
    return this.#card.getWeaponType();
  }

  getArmorType() {
    return this.#card.getArmorType();
  }

  getXCoordinate() {
    return this.#card.getXCoordinate();
  }

  getYCoordinate() {
    return this.#card.getYCoordinate();
  }

  getBigVersionWidth() {
    return this.#card.getBigVersionWidth();
  }

  getBigVersionHeight() {
    return this.#card.getBigVersionHeight();
  }

  getCurrentWidth() {
    return this.#card.getCurrentWidth();
  }

  getCurrentHeight() {
    return this.#card.getCurrentHeight();
  }

  getState() {
    return this.#state;
  }

  setCurrentWidth(newCurrentWidth) {
    this.#card.setCurrentWidth(newCurrentWidth);
  }

  setCurrentHeight(newCurrentHeight) {
    this.#card.setCurrentHeight(newCurrentHeight);
  }
}
