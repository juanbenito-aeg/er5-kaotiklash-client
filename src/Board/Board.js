export default class Board {
  #grids;
  #image;

  constructor(grids, image) {
    this.#grids = grids;
    this.#image = image;
  }

  getGrids() {
    return this.#grids;
  }

  getImage() {
    return this.#image;
  }

  setImage(newImage) {
    this.#image = newImage;
  }
}
