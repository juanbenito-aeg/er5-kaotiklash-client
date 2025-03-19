export default class Board {
  #grids;
  #imageInfo;

  constructor(grids, imageInfo) {
    this.#grids = grids;
    this.#imageInfo = imageInfo;
  }

  getGrids() {
    return this.#grids;
  }

  getImageInfo() {
    return this.#imageInfo;
  }

  setImageInfo(newImageInfo) {
    this.#imageInfo = newImageInfo;
  }
}
