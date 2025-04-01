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
  #isMouseOver;
  #isLeftClicked;

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
    this.#isMouseOver = false;
    this.#isLeftClicked = false;
  }

  getXCoordinate() {
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }

  setXCoordinate(newXCoordinate) {
    return (this.#xCoordinate = newXCoordinate);
  }

  setYCoordinate(newYCoordinate) {
    return (this.#yCoordinate = newYCoordinate);
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
    if (
      this.#state === BoxState.AVAILABLE ||
      this.#state === BoxState.SELECTED
    ) {
      this.#card = card;

      this.setState(BoxState.OCCUPIED);
    }
  }

  resetCard() {
    this.#card = null;
    this.setState(BoxState.AVAILABLE);
  }

  isOccupied() {
    return this.#card !== null;
  }

  isMouseOver() {
    return this.#isMouseOver;
  }

  setIsMouseOver(isMouseOver) {
    this.#isMouseOver = isMouseOver;
  }

  isLeftClicked() {
    return this.#isLeftClicked;
  }

  setIsLeftClicked(isLeftClicked) {
    this.#isLeftClicked = isLeftClicked;
  }
}
