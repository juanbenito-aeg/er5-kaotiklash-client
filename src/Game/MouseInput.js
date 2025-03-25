import { globals } from "../index.js";
import { BoxState } from "./constants.js";

export default class MouseInput {
  #mouseXCoordinate;
  #mouseYCoordinate;
  #leftButtonPressed;
  #rightButtonPressed;

  constructor() {
    this.#mouseXCoordinate = 0;
    this.#mouseYCoordinate = 0;
    this.#leftButtonPressed = false;
    this.#rightButtonPressed = false;
  }

  addMouseEventListeners() {
    window.addEventListener("contextmenu", function (event) {
      // DISABLE THE CONTEXT-MENU FOR THE WHOLE PAGE
      event.preventDefault();
    });

    globals.canvas.addEventListener(
      "mousedown",
      this.canvasMouseDownHandler.bind(this),
      false
    );

    globals.canvas.addEventListener(
      "mouseup",
      this.canvasMouseUpHandler.bind(this),
      false
    );

    globals.canvas.addEventListener(
      "mousemove",
      this.canvasMouseMoveHandler.bind(this),
      false
    );
  }

  canvasMouseDownHandler(event) {
    if (event.button === 0) {
      this.#leftButtonPressed = true;
    } else if (event.button === 2) {
      this.#rightButtonPressed = true;
    }
  }

  canvasMouseUpHandler(event) {
    if (event.button === 0) {
      this.#leftButtonPressed = false;
    } else if (event.button === 2) {
      this.#rightButtonPressed = false;
    }
  }

  canvasMouseMoveHandler(event) {
    //FIND THE MOUSE'S X AND Y POSITIONS ON THE CANVAS
    this.#mouseXCoordinate = event.pageX - globals.canvas.offsetLeft;
    this.#mouseYCoordinate = event.pageY - globals.canvas.offsetTop;
  }

  getMouseXCoordinate() {
    return this.#mouseXCoordinate;
  }

  getMouseYCoordinate() {
    return this.#mouseYCoordinate;
  }

  isLeftButtonPressed() {
    return this.#leftButtonPressed;
  }

  isRightButtonPressed() {
    return this.#rightButtonPressed;
  }

  setLeftButtonPressedFalse() {
    this.#leftButtonPressed = false;
  }

  setRightButtonPressedFalse() {
    this.#rightButtonPressed = false;
  }

  isMouseOverBox(box) {
    let isOverBox;

    const boxX = box.getXCoordinate();
    const boxY = box.getYCoordinate();
    const boxWidth = box.getWidth();
    const boxHeight = box.getHeight();

    isOverBox =
      this.#mouseXCoordinate >= boxX &&
      this.#mouseXCoordinate <= boxX + boxWidth &&
      this.#mouseYCoordinate >= boxY &&
      this.#mouseYCoordinate <= boxY + boxHeight;

    return isOverBox;
  }

  /* calculeCollisionBetweenMouseAndDecks(deck) {
    for (let i = 0; i < deck.length; i++) {
      let cards = deck[i];
      for (let j = 0; j < cards.getCards(); j++) {
        const card = cards.getCards()[j];
        const xCard = card.getXCoordinate();
        const yCard = card.getYCoordinate();

      }
    }
  } */
}
