export default class CardView {
  #card;
  #xCoordinate;
  #yCoordinate;
  #imageSet;

  constructor(card, xCoordinate, yCoordinate, imageSet) {
    this.#card = card;
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#imageSet = imageSet;
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

  getImageSet() {
    return this.#imageSet;
  }

  getXCoordinate() {
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }
}
