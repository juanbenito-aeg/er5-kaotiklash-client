import Grid from "./Grid.js";

export default class Board {
  #grids;
  #image;

  constructor(grids, image) {
    this.#grids = grids;
    this.#image = image;
  }

  create() {
    this.createBoard();
    const grid1 = new Grid();
    const grid2 = new Grid();
    //EXAMPLE OF GRID SIZE, NEED TO BE UPDATE
    grid1.create(0, 0, 0, 0);
    grid2.create(0, 0, 0, 0);

    this.#grids.push(grid1, grid2);
  }

  get grids() {
    return this.#grids;
  }

  createBoard() {
    this.#image = new Image();
    this.#image.src = "../images/board.jpg";
  }
}
