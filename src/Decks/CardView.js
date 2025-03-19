export default class CardView {
  #card;
  #imageSet;

  constructor(card, imageSet) {
    this.#card = card;
    this.#imageSet = imageSet;
  }

  getImageSet() {
    return this.#imageSet;
  }
}
