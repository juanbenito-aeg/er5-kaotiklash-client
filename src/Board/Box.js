import { BoxState } from "../Game/constants.js";

export default class Box {
  #xCoordinate;
  #yCoordinate;
  #width;
  #height;
  #isAdvantageous;
  #isDangerous;
  #state;
  #battlefieldAreaItBelongsTo;
  #card;

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
    this.#card = null;
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

  setState(state) {
    this.#state = state;
  }

  getBattlefieldAreaItBelongsTo() {
    return this.#battlefieldAreaItBelongsTo;
  }

  getCard() {
    return this.#card;
  }

  setCard(card) {
    if (this.#state === BoxState.AVAILABLE) {
      this.#card = card;
      this.setState(BoxState.OCCUPIED);
      }
  }
  
  isOccupied() {
    return this.#card !== null;
    }
}
