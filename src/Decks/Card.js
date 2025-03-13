export default class Card {
  #id;
  #nameENG;
  #nameEUS;
  #descriptionENG;
  #descriptionEUS;

  constructor(id, nameENG, nameEUS, descriptionENG, descriptionEUS) {
    this.#id = id;
    this.#nameENG = nameENG;
    this.#nameEUS = nameEUS;
    this.#descriptionENG = descriptionENG;
    this.#descriptionEUS = descriptionEUS;
  }
}
