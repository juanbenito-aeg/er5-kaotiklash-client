import Grid from "./Grid.js";

export default class Board {
  #grids;

  constructor() {
    this.#grids = []; 
  }

  create() {
   
    const grid1 = new Grid();
    const grid2 = new Grid();
    //EXAMPLE OF GRID SIZE, NEED TO BE UPDATE
    grid1.create(0, 0, 0, 0); 
    grid2.create(0, 0, 0, 0); 

    const grids = this.#grids.push(grid1, grid2); 

    return grids; 
  }

  get grids() {
    return this.#grids; 
  }
}
