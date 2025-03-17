export default class CardView {
  #card;
  #xCoordinate;
  #yCoordinate;
  #bigVersionWidth;
  #bigVersionHeight;
  #smallVersionWidth;
  #smallVersionHeight;
  #currentWidth;
  #currentHeight;

  constructor(
    card,
    xCoordinate,
    yCoordinate,
    bigVersionWidth,
    bigVersionHeight,
    smallVersionWidth,
    smallVersionHeight,
    currentWidth,
    currentHeight
  ) {
    this.#card = card;
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#bigVersionWidth = bigVersionWidth;
    this.#bigVersionHeight = bigVersionHeight;
    this.#smallVersionWidth = smallVersionWidth;
    this.#smallVersionHeight = smallVersionHeight;
    this.#currentWidth = currentWidth;
    this.#currentHeight = currentHeight;
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

  getBigVersionWidth() {
    return this.#bigVersionWidth;
  }

  getBigVersionHeight() {
    return this.#bigVersionHeight;
  }

  getSmallVersionWidth() {
    return this.#smallVersionWidth;
  }

  getSmallVersionHeight() {
    return this.#smallVersionHeight;
  }

  getCurrentWidth() {
    return this.#currentWidth;
  }

  getCurrentHeight() {
    return this.#currentHeight;
  }

  setXCoordinate(newXCoordinate) {
    this.#xCoordinate = newXCoordinate;
  }

  setYCoordinate(newYCoordinate) {
    this.#yCoordinate = newYCoordinate;
  }

  setCurrentWidth(newCurrentWidth) {
    this.#currentWidth = newCurrentWidth;
  }

  setCurrentHeight(newCurrentHeight) {
    this.#currentHeight = newCurrentHeight;
  }
}
