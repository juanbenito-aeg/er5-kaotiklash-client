import Message from "./Message.js";
import { PhaseType } from "../Game/constants.js";
import { globals } from "../index.js";

export default class PhasesMessages extends Message {
  #type;
  #content;
  #targetPhase;

  constructor(type, content, targetPhase) {
    super();
    this.#type = type;
    this.#content = content;
    this.#targetPhase = targetPhase;
  }

  static create(phaseType, language) {
    const content = this.#getContent(phaseType, language);
    return new PhasesMessages(phaseType, content);
  }

  static #getContent(phaseType, language) {
    const messages = {
      [PhaseType.PREPARE_EVENT]: {
        ENG: "Select a card to prepare.",
        EUS: "",
      },
      [PhaseType.PERFORM_eVENT]: {
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

  execute(currentPhase) {
    return currentPhase !== this.#targetPhase;
  }
}
