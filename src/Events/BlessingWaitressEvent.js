import Event from "./Event.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import globals from "../Game/globals.js";
import { BlessingWaitressState, CardState } from "../Game/constants.js";
import Physics from "../Game/Physics.js";

export default class BlessingWaitressEvent extends Event {
  #state;
  #phaseMessage;
  #stateMessages;
  #currentPlayerMinionsInPlayDeck;
  #eventWithoutDurationData;

  constructor(
    executedBy,
    eventCard,
    phaseMessage,
    stateMessages,
    currentPlayerMinionsInPlayDeck,
    eventWithoutDurationData
  ) {
    super(executedBy, eventCard);

    this.#state = BlessingWaitressState.INIT;
    this.#phaseMessage = phaseMessage;
    this.#stateMessages = stateMessages;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#eventWithoutDurationData = eventWithoutDurationData;
  }

  execute() {
    switch (this.#state) {
      case BlessingWaitressState.INIT:
        this.#resetMinionsStateToPlaced();
        break;

      case BlessingWaitressState.SELECT_MINION:
        console.log("SELECT MINION TO HEAL");
        this.#selectMinionToHeal();
        break;

      case BlessingWaitressState.HEAL:
        this.#healSelectedMinion();
        break;
    }
  }

  #resetMinionsStateToPlaced() {
    for (
      let i = 0;
      i < this.#currentPlayerMinionsInPlayDeck.getCards().length;
      i++
    ) {
      const currentCard = this.#currentPlayerMinionsInPlayDeck.getCards()[i];

      currentCard.setState(CardState.PLACED);
    }

    this.#state = BlessingWaitressState.SELECT_MINION;
  }

  #selectMinionToHeal() {
    this.#phaseMessage.setCurrentContent(
      PhaseMessage.content.blessingWaitress.selectMinion[globals.language]
    );

    const hoveredCard =
      this.#currentPlayerMinionsInPlayDeck.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        this.#state = BlessingWaitressState.HEAL;
      }
    }
  }

  #healSelectedMinion() {
    const selectedCard =
      this.#currentPlayerMinionsInPlayDeck.lookForSelectedCard();
    selectedCard.setState(CardState.PLACED);

    let newHP = Math.min(
      selectedCard.getCurrentHP() + 30,
      selectedCard.getInitialHP()
    );

    // VARIABLE USED BY THE STATE MESSAGE
    let hpToRestore;

    if (newHP === selectedCard.getInitialHP()) {
      hpToRestore = selectedCard.getInitialHP() - selectedCard.getCurrentHP();
    } else {
      hpToRestore = 30;
    }

    // HP RESTORATION
    selectedCard.setCurrentHP(newHP);

    // STATE MESSAGE CREATION

    const restoredHPMsgXCoordinate =
      selectedCard.getXCoordinate() +
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2;

    const restoredHPMsgYCoordinate =
      selectedCard.getYCoordinate() +
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height / 2;

    const restoredHPMsg = new StateMessage(
      `+${hpToRestore} HP`,
      "20px MedievalSharp",
      "rgb(250 233 183)",
      1,
      4,
      restoredHPMsgXCoordinate,
      restoredHPMsgYCoordinate,
      2,
      new Physics(0, 0, 0, 0, 0, 0, 0)
    );

    this.#stateMessages.push(restoredHPMsg);

    this.#eventWithoutDurationData.isActive = false;
    this.#eventWithoutDurationData.instance = {};
  }
}
