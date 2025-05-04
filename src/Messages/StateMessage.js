import Message from "./Message.js";
import globals from "../Game/globals.js";

export default class StateMessage extends Message {
  #content;
  #font;
  #color;
  #duration;
  #startTime;
  #xPosition;
  #yPosition;
  #animationType;

  constructor(content, font, color, duration, xPosition, yPosition, animationType) {
    super();

    this.#content = content;
    this.#font = font;
    this.#color = color;
    this.#duration = duration;
    this.#xPosition = xPosition;
    this.#yPosition = yPosition;
    this.#animationType = animationType;
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

  getFont() {
    return this.#font;
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

  getAnimationType() {
    return this.#animationType;
  }
}
