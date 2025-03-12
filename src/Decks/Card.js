export default class Card {
  #id;
  #category;
  #nameENG;
  #nameEUS;
  #descriptionENG;
  #descriptionEUS;

  constructor(id, category, nameENG, nameEUS, descriptionENG, descriptionEUS) {
    this.#id = id;
    this.#category = category;
    this.#nameENG = nameENG;
    this.#nameEUS = nameEUS;
    this.#descriptionENG = descriptionENG;
    this.#descriptionEUS = descriptionEUS;
  }
}
