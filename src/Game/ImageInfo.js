export default class ImageInfo {
  #imageObj;
  #sourceX;
  #sourceY;
  #sourceWidth;
  #sourceHeight;
  #destinationX;
  #destinationY;
  #smallVerDestinationWidth;
  #smallVerDestinationHeight;
  #bigVerDestinationWidth;
  #bigVerDestinationHeight;

  constructor(
    imageObj,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destinationX,
    destinationY,
    smallVerDestinationWidth,
    smallVerDestinationHeight,
    bigVerDestinationWidth,
    bigVerDestinationHeight
  ) {
    this.#imageObj = imageObj;
    this.#sourceX = sourceX;
    this.#sourceY = sourceY;
    this.#sourceWidth = sourceWidth;
    this.#sourceHeight = sourceHeight;
    this.#destinationX = destinationX;
    this.#destinationY = destinationY;
    this.#smallVerDestinationWidth = smallVerDestinationWidth;
    this.#smallVerDestinationHeight = smallVerDestinationHeight;
    this.#bigVerDestinationWidth = bigVerDestinationWidth;
    this.#bigVerDestinationHeight = bigVerDestinationHeight;
  }

  getImageObj() {
    return this.#imageObj;
  }

  getSourceX() {
    return this.#sourceX;
  }

  getSourceY() {
    return this.#sourceY;
  }

  getSourceWidth() {
    return this.#sourceWidth;
  }

  getSourceHeight() {
    return this.#sourceHeight;
  }

  getDestinationX() {
    return this.#destinationX;
  }

  getDestinationY() {
    return this.#destinationY;
  }

  getSmallVerDestinationWidth() {
    return this.#smallVerDestinationWidth;
  }

  getSmallVerDestinationHeight() {
    return this.#smallVerDestinationHeight;
  }

  getBigVerDestinationWidth() {
    return this.#bigVerDestinationWidth;
  }

  getBigVerDestinationHeight() {
    return this.#bigVerDestinationHeight;
  }
}
