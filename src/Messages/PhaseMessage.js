import Message from "./Message.js";
import {
  PhaseType,
  PrepareEventState,
  MovePhaseState,
  AttackPhaseState,
  EquipWeaponState,
} from "../Game/constants.js";

export default class PhaseMessage extends Message {
  #currentMessage;

  constructor() {
    super();
  }

  static create() {
    const phaseMessage = new PhaseMessage();

    return phaseMessage;
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
          ENG: "Choose a minion to attack.",
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

    // FIRST TRY TO GET THE SPECIFIC PHASE AND STATE
    if (
      messages[phaseType] &&
      messages[phaseType][phaseState] &&
      messages[phaseType][phaseState][language]
    ) {
      return messages[phaseType][phaseState][language];
    }

    // FIRST TRY TO GET THE SPECIFIC PHASE WITHOUT THE STATE
    if (messages[phaseType] && messages[phaseType][language]) {
      return messages[phaseType][language];
    }

    // IF NOTHING FOUND, RETURN THE INVALID MESSAGE AS DEFAULT
    return messages[PhaseType.INVALID][PhaseType.INVALID][language];
  }

  execute(currentPhase) {
    return currentPhase !== this.#targetPhase;
  }
}
