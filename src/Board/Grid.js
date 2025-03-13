import Box from "./Box.js";

export default class Grid {
  #boxes;

  constructor() {
    this.#boxes = [];
  }

  create(numX, numY, xInit, yInit) {
    //GRIDS CREATION
    for (let i = 0; i < numX; i++) {
      for (let j = 0; j < numY; j++) {
        const xCoordinate = xInit + i;
        const yCoordinate = yInit + j;
        const width = 50; //FAKE DATA
        const height = 50; //FAKE DATA
        const isAdvantageous = false; 
        const isDangerous = false; 
        const stateMachine = {}; 
        const state = 0; 

        const box = new Box(xCoordinate, yCoordinate, width, height, isAdvantageous, isDangerous, stateMachine, state);
        this.#boxes.push(box);
      }
    }
    return this;
  }

  get boxes() {
    return this.#boxes;
  }
}
