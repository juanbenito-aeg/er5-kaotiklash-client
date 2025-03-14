export default class CardView {
  #xCoordinate;
  #yCoordinate;
  #imageSets;

  constructor(xCoordinate, yCoordinate, imageSets) {
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#imageSets = imageSets;
  }

  getXCoordinate() {
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }

  setXCoordinate(newXCoordinate) {
    this.#xCoordinate = newXCoordinate;
    return this.#xCoordinate;
  }

  setYCoordinate(newYCoordinate) {
    this.#yCoordinate = newYCoordinate;
    return this.#yCoordinate;
  }

  getImageSets() {
    return this.#imageSets;
  }
}
