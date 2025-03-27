import Message from "./Message.js";
import { PhaseType } from "../Game/constants.js";
import { globals } from "../index.js";

export default class PhasesMessages extends Message {
  #type;
  #content;
  #duration;
  #startTime;

  constructor(type, content, duration) {
    super();
    this.#type = type;
    this.#content = content;
    this.#duration = duration;
  }

  static create(phaseType, language, duration) {
    const content = this.#getContent(phaseType, language);
    duration = 3000;
    const message = new PhasesMessages(phaseType, content, duration);
    return message;
  }

  static #getContent(phaseType, language) {
    const messages = {
      [PhaseType.PREPARE_EVENT]: {
        ENG: "Select a card to prepare.",
        EUS: "",
      },
      [PhaseType.PERFORM_EVENT]: {
        ENG: "An event is happening...",
        EUS: "",
      },
      [PhaseType.MOVE]: {
        ENG: "Select a cell to move.",
        EUS: "",
      },
      [PhaseType.ATTACK]: {
        ENG: "Select a minion to attack.",
        EUS: ".",
      },
    };
    if (messages[phaseType]) {
      if (messages[phaseType][language] !== undefined) {
        return messages[phaseType][language];
      }
    }
  }

  execute() {
    if (this.#startTime === null) {
      this.#startTime = globals.deltaTime;
    }
    if (globals.deltaTime - this.#startTime >= this.#duration) {
      console.log("armagedon.");
      return true; //MESSAGE IS OVER
    }
    return false; // MESSAGE IS ACTIVE
  }
}
