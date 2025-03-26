import Message from "./Message.js";
import { globals } from "../index.js";

export default class DamageMessages extends Message {
  #content;
  #duration;
  #startTime;

  constructor(content, duration) {
    super();
    this.#content = content;
    this.#duration = duration;
  }

  static create(damage, duration) {
    const content = this.#getContent(damage);
    duration = 2000;
    const message = new DamageMessages(content, duration);
    return message;
  }

  static #getContent(damage) {

  }

  execute() {
    if (this.#startTime === null) {
      this.#startTime = globals.deltaTime;
    }
    if (globals.deltaTime - this.#startTime >= this.#duration) {

        return true; //MESSAGE IS OVER
    }
    return false; // MESSAGE IS ACTIVE
  }
}
