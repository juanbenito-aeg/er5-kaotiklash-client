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

  getCard() {
    return this.#card;
  }

  getIcons() {
    return this.#icons;
  }
}
