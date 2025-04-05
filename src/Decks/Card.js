export default class Card {
  #category;
  #id;
  #name;
  #description;
  #isMouseOver;
  #isLeftClicked;
  #isRightClicked;

  constructor(category, id, name, description) {
    this.#category = category;
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#isMouseOver = false;
    this.#isLeftClicked = false;
    this.#isRightClicked = false;
  }

  getCategory() {
    return this.#category;
  }

  getID() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getDescription() {
    return this.#description;
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

  isRightClicked() {
    return this.#isRightClicked;
  }

  setIsRightClicked(isRightClicked) {
    this.#isRightClicked = isRightClicked;
  }

  getBoxIsPositionedIn(gridWhereToLookForBox, card) {
    for (let i = 0; i < gridWhereToLookForBox.getBoxes().length; i++) {
      const currentBox = gridWhereToLookForBox.getBoxes()[i];

      if (currentBox.getCard() === card) {
        return currentBox;
      }
    }
  }
}
