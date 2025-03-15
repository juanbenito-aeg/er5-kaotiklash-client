export default class ImageSet {
  #image;
  #xInit;
  #yInit;
  #xSize;
  #ySize;
  #xDestinationSize;
  #yDestinationSize;

  constructor(xInit, yInit, xSize, ySize, xDestinationSize, yDestinationSize) {
    this.#xInit = xInit;
    this.#yInit = yInit;
    this.#xSize = xSize;
    this.#ySize = ySize;
    this.#xDestinationSize = xDestinationSize;
    this.#yDestinationSize = yDestinationSize;
  }

  getImage() {
    return this.#image;
  }

  getXInit() {
    return this.#xInit;
  }

  getYInit() {
    return this.#yInit;
  }

  getXSize() {
    return this.#xSize;
  }

  getYSize() {
    return this.#ySize;
  }

  getXDestinationSize() {
    return this.#xDestinationSize;
  }

  getYDestinationSize() {
    return this.#yDestinationSize;
  }

  setImage(newImage) {
    this.#image = newImage;
  }
}
