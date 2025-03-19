export default class Grid {
  #gridType;
  #boxes;

  constructor(gridType, boxes) {
    this.#gridType = gridType;
    this.#boxes = boxes;
  }

  getBoxes() {
    return this.#boxes;
  }
}
