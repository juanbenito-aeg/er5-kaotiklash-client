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

  lookForHoveredBox() {
    for (let i = 0; i < this.getBoxes().length; i++) {
      const currentBox = this.getBoxes()[i];

      if (currentBox.isMouseOver()) {
        return currentBox;
      }
    }
  }

  lookForLeftClickedBox() {
    for (let i = 0; i < this.getBoxes().length; i++) {
      const currentBox = this.getBoxes()[i];

      if (currentBox.isLeftClicked()) {
        return currentBox;
      }
    }
  }
}
