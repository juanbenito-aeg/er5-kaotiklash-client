export default class CardView {
  #card;
  #xCoordinate;
  #yCoordinate;

  constructor(card, xCoordinate, yCoordinate) {
    this.#card = card;
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
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
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }

  setXCoordinate(newXCoordinate) {
    this.#xCoordinate = newXCoordinate;
  }

  setYCoordinate(newYCoordinate) {
    this.#yCoordinate = newYCoordinate;
  }
}
