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

  static create(phaseType, language, duration) {
    const content = this.getContent(phaseType, language);
    duration = 3000;
    const message = new PhasesMessages(phaseType, content, duration);
    return message;
  }

  getContent(phaseType, language) {
    const messages = {
      [PhaseType.INVALID]: {
        ENG: "Select a phase.",
        EUS: "",
      },
      [PhaseType.PREPARE_EVENT]: {
        ENG: "Select a card to prepare.",
        EUS: "",
      },
      [PhaseType.PERFORM_EVENT]: {
        ENG: "An event is happening...",
        EUS: "",
      },
      [PhaseType.MOVE]: {
        ENG: "Select a minion to move.",
        EUS: "",
      },
      [PhaseType.ATTACK]: {
        ENG: "Select a minion to attack.",
        EUS: ".",
      },
      [PhaseType.SKIP]: {
        ENG: "You have skiped a phase.",
        EUS: ".",
      },
      [PhaseType.EQUIP_WEAPON]: {
        ENG: "Select a minion to equip the weapon.",
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
