import Message from "./Message.js";
import { globals } from "../index.js";

export default class StateMessage extends Message {
  #content;
  #font;
  #color;
  #duration;
  #startTime;
  #xPosition;
  #yPosition;

  constructor(content, font, color, duration, xPosition, yPosition) {
    super();

    this.#content = content;
    this.#font = font;
    this.#color = color;
    this.#duration = duration;
    this.#xPosition = xPosition;
    this.#yPosition = yPosition;
  }

  execute() {
    if (this.#startTime === null) {
      this.#startTime = globals.deltaTime;
    }

    if (this.#duration <= 0) {
      return true; // MESSAGE IS OVER
    }

    this.#duration -= globals.deltaTime;

    return false; // MESSAGE IS ACTIVE
  }

  getContent() {
    return this.#content;
  }

  getColor() {
    return this.#color;
  }

  getDuration() {
    return this, this.#duration;
  }

  getXPosition() {
    return this.#xPosition;
  }

  getYPosition() {
    return this.#yPosition;
  }

  getFont() {
    return this.#font;
  }
}
