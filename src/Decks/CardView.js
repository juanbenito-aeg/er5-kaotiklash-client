export default class CardView {
  #card;
  #xCoordinate;
  #yCoordinate;
  #bigVersionReverseImageSet;
  #smallVersionReverseImageSet;
  #bigVersionImageSet;
  #smallVersionImageSet;
  #bigVersionTemplateImageSet;
  #smallVersionTemplateImageSet;
  #iconsImageSets;

  constructor(
    card,
    xCoordinate,
    yCoordinate,
    bigVersionReverseImageSet,
    smallVersionReverseImageSet,
    bigVersionImageSet,
    smallVersionImageSet,
    bigVersionTemplateImageSet,
    smallVersionTemplateImageSet,
    iconsImageSets
  ) {
    this.#card = card;
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#bigVersionReverseImageSet = bigVersionReverseImageSet;
    this.#smallVersionReverseImageSet = smallVersionReverseImageSet;
    this.#bigVersionImageSet = bigVersionImageSet;
    this.#smallVersionImageSet = smallVersionImageSet;
    this.#bigVersionTemplateImageSet = bigVersionTemplateImageSet;
    this.#smallVersionTemplateImageSet = smallVersionTemplateImageSet;
    this.#iconsImageSets = iconsImageSets;
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
