export default class ImageSet {
  #reverse;
  #card;
  #smallVersionTemplate;
  #bigVersionTemplate;
  #icons;

  constructor(reverse, card, smallVersionTemplate, bigVersionTemplate, icons) {
    this.#reverse = reverse;
    this.#card = card;
    this.#smallVersionTemplate = smallVersionTemplate;
    this.#bigVersionTemplate = bigVersionTemplate;
    this.#icons = icons;
  }

  getReverse() {
    return this.#reverse;
  }

  getCard() {
    return this.#card;
  }

  getSmallVersionTemplate() {
    return this.#smallVersionTemplate;
  }

  getBigVersionTemplate() {
    return this.#bigVersionTemplate;
  }

  getIcons() {
    return this.#icons;
  }
}
