export default class Player {
  #id;
  #name;
  #totalHP;

  constructor(id, name, totalHP) {
    this.#id = id;
    this.#name = name;
    this.#totalHP = totalHP;
  }

  getID() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getTotalHP() {
    return this.#totalHP;
  }
}
