export default class ImageSet {
  #image;
  #xInit;
  #yInit;
  #xSize;
  #ySize;
  #xDestinationSize;
  #yDestinationSize;

  constructor(
    image,
    xInit,
    yInit,
    xSize,
    ySize,
    xDestinationSize,
    yDestinationSize
  ) {
    this.#image = image;
    this.#xInit = xInit;
    this.#yInit = yInit;
    this.#xSize = xSize;
    this.#ySize = ySize;
    this.#xDestinationSize = xDestinationSize;
    this.#yDestinationSize = yDestinationSize;
  }
}
