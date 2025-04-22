import { HandOfTheSoulThiefState } from "../Game/constants.js";
import Message from "./Message.js";

export default class PhaseMessage extends Message {
  static content = {
    invalid: [
      // ENG
      "Select a phase.",

      // EUS
      "",
    ],

    drawCard: {
      initialDraw: [
        // ENG
        "Drawing cards from the events deck...",

        // EUS
        "",
      ],
      subsequentDraw: [
        // ENG
        "Drawing a card from the events deck...",

        // EUS
        "",
      ],
    },

    prepareEvent: {
      selectHandCard: [
        // ENG
        "Select a card from your hand.",

        // EUS
        "",
      ],
      selectTargetGrid: [
        // ENG
        "Choose a destination.",

        // EUS
        "",
      ],
      moveCard: [
        // ENG
        "Moving card...",

        // EUS
        "",
      ],
    },

    move: {
      selectCard: [
        // ENG
        "Select a minion to move.",

        // EUS
        "",
      ],
      selectTarget: [
        // ENG
        "Choose a destination.",

        // EUS
        "",
      ],
      moveCard: [
        // ENG
        "Moving minion...",

        // EUS
        "",
      ],
    },

    attack: {
      selectAttacker: [
        // ENG
        "Select the attacking minion.",

        // EUS
        "",
      ],
      selectTarget: [
        // ENG
        "Select the target.",

        // EUS
        "",
      ],
    },

    discardCard: {
      mandatoryDiscard: [
        // ENG
        "Select a card to discard to leave a box free.",

        // EUS
        "",
      ],
      optionalDiscard: [
        // ENG
        "Optionally select a card to discard.",

        // EUS
        "",
      ],
    },

    equipWeaponOrArmor: {
      selectMinion: [
        // ENG
        "Choose a minion to equip.",

        // EUS
        "",
      ],
      equip: [
        // ENG
        "Equipping minion...",

        // EUS
        "",
      ],
    },

    blessingWaitress: {
      selectMinion: [
        // ENG
        "Select a minion to heal.",

        // EUS
        "",
      ],
    },
    echoOfTheStratagen: {
      selectEnemyCard: [
        //ENG
        "Select a enemy event to steal.",

        // EUS
        "",
      ],
    },

    handOfTheSoulThief: {
      selectEnemyCard: [
        // ENG
        "Select a enemy card to steal.",

        // EUS
        "",
      ],
      selectCardInHand: [
        // ENG
        "Select a card to exchange.",

        // EUS
        "",
      ],
    },

    stolenFate: {
      discardCardsInHand: [
        // ENG
        "Discard cards in hand to leave 2 boxes free.",

        // EUS
        "",
      ],
    },
  };

  #currentContent;

  constructor(initialContent) {
    super();

    this.#currentContent = initialContent;
  }

  static create(initialContent) {
    const phaseMessage = new PhaseMessage(initialContent);

    return phaseMessage;
  }

  getCurrentContent() {
    return this.#currentContent;
  }

  setCurrentContent(newContent) {
    this.#currentContent = newContent;
  }
}
