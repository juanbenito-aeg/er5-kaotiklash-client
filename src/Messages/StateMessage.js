import Message from "./Message.js";
import globals from "../Game/globals.js";

export default class StateMessage extends Message {
  #content;
  #font;
  #color;
  #alpha;
  #duration;
  #startTime;
  #xPosition;
  #yPosition;
  #timeToFade;
  #physics;
  #type;

  constructor(
    content,
    font,
    color,
    alpha,
    duration,
    xPosition,
    yPosition,
    timeToFade,
    physics,
    type
  ) {
    super();

    this.#content = content;
    this.#font = font;
    this.#color = color;
    this.#alpha = alpha;
    this.#duration = duration;
    this.#xPosition = xPosition;
    this.#yPosition = yPosition;
    this.#timeToFade = timeToFade;
    this.#physics = physics;
    this.#type = type;
  }

  static isMsgOfTypeXAlreadyCreated(stateMessages, type) {
    let isMsgOfTypeXAlreadyCreated = false;

    for (let i = 0; i < stateMessages.length; i++) {
      const currentStateMsg = stateMessages[i];

      if (currentStateMsg.#type === type) {
        isMsgOfTypeXAlreadyCreated = true;

        break;
      }
    }

    return isMsgOfTypeXAlreadyCreated;
  }

  execute() {
    if (this.#startTime === null) {
      this.#startTime = globals.deltaTime;
    }

    this.#duration -= globals.deltaTime;

    if (this.#duration <= this.#timeToFade) {
      this.#alpha -= globals.deltaTime / this.#timeToFade;
      this.#yPosition -= this.#physics.getVY() * globals.deltaTime;
      this.#alpha = Math.max(this.#alpha, 0);
    }

    if (this.#alpha <= 0) {
      return true;
    }

    return false;
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

  getAlpha() {
    return this.#alpha;
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

  getTimeToFade() {
    return this.#timeToFade;
  }

  setVY(vy) {
    this.#physics.setVY(vy);
  }
}
