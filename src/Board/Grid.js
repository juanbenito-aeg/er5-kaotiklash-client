export default class Grid {
  #gridType;
  #boxes;

  constructor(gridType, boxes) {
    this.#gridType = gridType;
    this.#boxes = boxes;
  }

  getGridType() {
    return this.#gridType;
  }

  getBoxes() {
    return this.#boxes;
  }
}
