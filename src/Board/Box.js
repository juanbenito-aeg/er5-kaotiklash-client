export default class Box {
  #xCoordinate;
  #yCoordinate;
  #width;
  #height;
  #isAdvantageous;
  #isDangerous;
  #state;
  #battlefieldAreaItBelongsTo;

  constructor(
    xCoordinate,
    yCoordinate,
    width,
    height,
    isAdvantageous,
    isDangerous,
    state,
    battlefieldAreaItBelongsTo
  ) {
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#width = width;
    this.#height = height;
    this.#isAdvantageous = isAdvantageous;
    this.#isDangerous = isDangerous;
    this.#state = state;
    this.#battlefieldAreaItBelongsTo = battlefieldAreaItBelongsTo;
  }

  getXCoordinate() {
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }

  getWidth() {
    return this.#width;
  }

  getHeight() {
    return this.#height;
  }

  isAdvantageous() {
    return this.#isAdvantageous;
  }

  isDangerous() {
    return this.#isDangerous;
  }

  getState() {
    return this.#state;
  }

  getBattlefieldAreaItBelongsTo() {
    return this.#battlefieldAreaItBelongsTo;
  }
}
