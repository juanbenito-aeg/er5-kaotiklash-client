import Grid from "./Grid.js";

export default class Board {
  #grids;
  #image;

  create() {
    this.createBoard();

    const grid1 = new Grid();
    const grid2 = new Grid();

    //EXAMPLE OF GRID SIZE, NEEDS TO BE UPDATED
    grid1.create(0, 0, 0, 0);
    grid2.create(0, 0, 0, 0);

    this.#grids = [grid1, grid2];
  }

  createBoard() {
    this.#image = new Image();
    this.#image.src = "../images/board.jpg";
  }

  getGrids() {
    return this.#grids;
  }

  getImage() {
    return this.#image;
  }
}
