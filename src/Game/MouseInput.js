import { globals } from "../index.js";
export default class MouseInput {

  #mouseXCoordinate;
  #mouseYCoordinate;
  #leftButtonPressed;
  #rigthButtonPressed;

  constructor(mouseXCoordinate, mouseYCoordinate, leftButtonPressed, rigthButtonPressed) {
    this.#mouseXCoordinate = mouseXCoordinate;
    this.#mouseYCoordinate = mouseYCoordinate;
    this.#leftButtonPressed = leftButtonPressed;
    this.#rigthButtonPressed = rigthButtonPressed;
  }

  mouseEventListener() {
    window.addEventListener("contextmenu", function (event) {
      // DISABLE THE CONTEXT-MENU FOR THE WHOLE PAGE
      event.preventDefault();
    });
    globals.canvas.addEventListener("mouseup", this.canvasMouseHandler.bind(this), false);
    globals.canvas.addEventListener("mousedown", this.canvasMouseDownHandler.bind(this), false);
    globals.canvas.addEventListener("mousemove", this.canvasMouseMoveHandler.bind(this), false);
  }

  canvasMouseHandler() {
    this.#leftButtonPressed = true;
    this.#rigthButtonPressed = true;
  }

  canvasMouseDownHandler() {
    this.#leftButtonPressed = false;
    this.#rigthButtonPressed = false;
  }

  canvasMouseMoveHandler(event) {
    //FIND THE MOUSE'S X AND Y POSITIONS ON THE CANVAS
    this.#mouseXCoordinate = event.pageX - globals.canvas.offsetLeft;
    this.#mouseYCoordinate = event.pageY - globals.canvas.offsetTop;
  }
}