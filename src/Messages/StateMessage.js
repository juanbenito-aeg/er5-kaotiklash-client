import Message from "./Message.js";
import { globals } from "../index.js";

export default class StateMessage extends Message {
  #content;
  #color;
  #duration;
  #startTime;
  #xPosition;
  #yPosition;

  constructor(content, color, duration, xPosition, yPosition) {
    super();

    this.#content = content;
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
}
