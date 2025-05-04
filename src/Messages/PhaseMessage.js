import Message from "./Message.js";

export default class PhaseMessage extends Message {
  static content = {
    invalid: [
      // ENG
      "Select a phase.",

      // EUS
      "Fase bat hautatu.",
    ],

    drawCard: {
      initialDraw: [
        // ENG
        "Drawing cards from the events deck...",

        // EUS
        "Kartak hartzen gertaeren karta-sortatik...",
      ],
      subsequentDraw: [
        // ENG
        "Drawing a card from the events deck...",

        // EUS
        "Karta bat hartzen gertaeren karta-sortatik...",
      ],
    },

    prepareEvent: {
      selectHandCard: [
        // ENG
        "Select a card from your hand.",

        // EUS
        "Karta bat aukeratu zure eskutik.",
      ],
      selectTargetGrid: [
        // ENG
        "Choose a destination.",

        // EUS
        "Helmuga bat aukeratu.",
      ],
      moveCard: [
        // ENG
        "Moving card...",

        // EUS
        "Karta mugitzen...",
      ],
    },

    move: {
      selectCard: [
        // ENG
        "Select a minion to move.",

        // EUS
        "Mugitu beharreko mendeko bat aukeratu.",
      ],
      selectTarget: [
        // ENG
        "Choose a destination.",

        // EUS
        "Helmuga bat aukeratu.",
      ],
      moveCard: [
        // ENG
        "Moving minion...",

        // EUS
        "Mendekoa mugitzen...",
      ],
    },

    attack: {
      selectAttacker: [
        // ENG
        "Select the attacking minion.",

        // EUS
        "Erasotzailea hautatu.",
      ],
      selectTarget: [
        // ENG
        "Select the target.",

        // EUS
        "Itua aukeratu.",
      ],
      targetOutOfLimit: [
        //ENG:
        "Target not within reach",

        //EUS
        "Lortu ezin den helburua",
      ],
    },

    discardCard: {
      mandatoryDiscard: [
        // ENG
        "Select a card to discard to leave a box free.",

        // EUS
        "Karta bat hautatu, baztertzeko eta lauki bat libre uzteko.",
      ],
      optionalDiscard: [
        // ENG
        "Optionally select a card to discard.",

        // EUS
        "Nahi izanez gero, karta bat aukeratu baztertzeko.",
      ],
    },

    equipWeaponOrArmor: {
      selectMinion: [
        // ENG
        "Choose a minion to equip.",

        // EUS
        "Hornitu beharreko mendeko bat hautatu.",
      ],
      equip: [
        // ENG
        "Equipping minion...",

        // EUS
        "Mendekoa hornitzen...",
      ],
    },

    blessingWaitress: {
      selectMinion: [
        // ENG
        "Select a minion to heal.",

        // EUS
        "Sendatu beharreko mendeko bat hautatu.",
      ],
    },
    echoOfTheStratagen: {
      selectEnemyCard: [
        //ENG
        "Select an enemy event to steal.",

        // EUS
        "Lapurtu beharreko etsaiaren gertaera-karta bat hautatu.",
      ],
    },

    handOfTheSoulThief: {
      selectEnemyCard: [
        // ENG
        "Select an enemy card to steal.",

        // EUS
        "Lapurtu beharreko etsaiaren karta bat hautatu.",
      ],
      selectCardInHand: [
        // ENG
        "Select a card to exchange.",

        // EUS
        "Trukatu beharreko karta bat aukeratu.",
      ],
    },

    stolenFate: {
      discardCardsInHand: [
        // ENG
        "Discard cards in hand to leave 2 boxes free.",

        // EUS
        "Baztertu behar adina karta zure eskutik, 2 lauki libre uzteko.",
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
