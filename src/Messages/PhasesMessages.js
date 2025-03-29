import Message from "./Message.js";
import {
  PhaseType,
  PrepareEventState,
  MovePhaseState,
  AttackPhaseState,
  EquipWeaponState,
  Language,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class PhasesMessages extends Message {
  #type;
  #state;
  #content;
  #targetPhase;

  constructor(type, state, content, targetPhase) {
    super();
    this.#type = type;
    this.#state = state;
    this.#content = content;
    this.#targetPhase = targetPhase;
  }

  static create(phaseType, phaseState, language, duration) {
    const messageInstance = new PhasesMessages(
      phaseType,
      phaseState,
      Language.ENGLISH,
      duration
    );
    const content = messageInstance.getContent(phaseType, phaseState, language);
    duration = 3000;
    const message = new PhasesMessages(
      phaseType,
      phaseState,
      content,
      duration
    );
    return message;
  }

  getContent(phaseType, phaseState, language) {
    const messages = {
      [PhaseType.INVALID]: {
        [PhaseType.INVALID]: {
          ENG: "Select a phase.",
          EUS: "",
        },
      },
      [PhaseType.PREPARE_EVENT]: {
        [PrepareEventState.INIT]: { ENG: "Preparing the event...", EUS: "" },
        [PrepareEventState.SELECT_HAND_CARD]: {
          ENG: "Select a card from your hand.",
          EUS: "",
        },
        [PrepareEventState.SELECT_TARGET_GRID]: {
          ENG: "Choose a grid to place the card.",
          EUS: "",
        },
        [PrepareEventState.END]: {
          ENG: "Event prepared successfully!",
          EUS: "",
        },
      },
      [PhaseType.PERFORM_EVENT]: {
        ENG: "An event is happening...",
        EUS: "",
      },
      [PhaseType.MOVE]: {
        [MovePhaseState.INIT]: { ENG: "Move phase begins.", EUS: "" },
        [MovePhaseState.SELECT_CARD]: {
          ENG: "Select a minion to move.",
          EUS: "",
        },
        [MovePhaseState.SELECT_TARGET]: {
          ENG: "Choose a destination.",
          EUS: "",
        },
        [MovePhaseState.MOVE_CARD]: { ENG: "Moving minion...", EUS: "" },
        [MovePhaseState.END]: { ENG: "Movement completed.", EUS: "" },
      },
      [PhaseType.ATTACK]: {
        [AttackPhaseState.INIT]: { ENG: "Attack phase begins.", EUS: "" },
        [AttackPhaseState.SELECT_ATTACKER]: {
          ENG: "Select an attacker minion.",
          EUS: "",
        },
        [AttackPhaseState.SELECT_TARGET]: {
          ENG: "Choose a target to attack.",
          EUS: "",
        },
        [AttackPhaseState.CALC_AND_APPLY_DMG]: {
          ENG: "Calculating damage...",
          EUS: "",
        },
        [AttackPhaseState.END]: { ENG: "Attack finished.", EUS: "" },
      },
      [PhaseType.SKIP]: {
        ENG: "You have skiped a phase.",
        EUS: ".",
      },
      [PhaseType.EQUIP_WEAPON]: {
        [EquipWeaponState.SELECT_WEAPON]: {
          ENG: "Select a weapon card.",
          EUS: "",
        },
        [EquipWeaponState.SELECT_MINION]: {
          ENG: "Choose a minion to equip.",
          EUS: "",
        },
        [EquipWeaponState.EQUIP_WEAPON]: {
          ENG: "Equipping weapon...",
          EUS: "",
        },
        [EquipWeaponState.END]: {
          ENG: "Weapon equipped successfully!",
          EUS: "",
        },
      },
    };
    if (messages[phaseType] && messages[phaseType][phaseState]) {
      if (messages[phaseType][phaseState][language] !== undefined) {
        return messages[phaseType][phaseState][language];
      }
    }
  }

  execute(currentPhase) {
    return currentPhase !== this.#targetPhase;
  }
}
