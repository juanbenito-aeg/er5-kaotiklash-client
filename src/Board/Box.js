export default class Box {
    #xCoordinate;
    #yCoordinate;
    #width;
    #height;
    #isAdvantageous;
    #isDangerous;
    #stateMachine;
    #state;
  
    constructor(xCoordinate, yCoordinate, width, height, isAdvantageous, isDangerous, stateMachine, state) {
      this.#xCoordinate = xCoordinate;
      this.#yCoordinate = yCoordinate;
      this.#width = width;
      this.#height = height;
      this.#isAdvantageous = isAdvantageous;
      this.#isDangerous = isDangerous;
      this.#stateMachine = stateMachine;
      this.#state = state;
    }
  
    get xCoordinate() {
      return this.#xCoordinate;
    }
  
    get yCoordinate() {
      return this.#yCoordinate;
    }
  
    get width() {
      return this.#width;
    }
  
    get height() {
      return this.#height;
    }
  
    get isAdvantageous() {
      return this.#isAdvantageous;
    }
  
    get isDangerous() {
      return this.#isDangerous;
    }
  
    get stateMachine() {
      return this.#stateMachine;
    }
  
    get state() {
      return this.#state;
    }
  }
  