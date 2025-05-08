export default class Player {
  #id;
  #name;
  #totalHP;

  constructor(id, name) {
    this.#id = id;
    this.#name = name;
  }

  getID() {
    return this.#id;
  }

  setID(newID) {
    this.#id = newID;
  }

  getName() {
    return this.#name;
  }

  getTotalHP() {
    return this.#totalHP;
  }

  setTotalHP(newTotalHP) {
    this.#totalHP = newTotalHP;
  }
}
