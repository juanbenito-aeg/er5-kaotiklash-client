import Message from "./Message.js";
import { globals } from "../index.js";

export default class DamageMessages extends Message {
  #content;
  #duration;
  #startTime;
  #xPosition;
  #yPosition;

  constructor(content, duration, xPosition, yPosition) {
    super();
    this.#content = content;
    this.#duration = duration;
    this.#xPosition = xPosition;
    this.#yPosition = yPosition;


  }

  static create(damage, duration, xPosition, yPosition) {

    duration = 2;
    const message = new DamageMessages(damage, duration, xPosition, yPosition);
    globals.damageMessages.push(message);
    return message;
  }

  execute() {
    if (this.#startTime === null) {
      this.#startTime = globals.deltaTime;
    }
    if (this.#duration <= 0) {
      return true; //MESSAGE IS OVER
    }
    this.#duration -= globals.deltaTime;

    return false; // MESSAGE IS ACTIVE
  }

  getContent()
  {
    return this.#content
  }

  getDuration()
  {
    return this,this.#duration
  }

  getXPosition()
  {
    return this.#xPosition
  }

  getYPosition()
  {
    return this.#yPosition
  }

}
