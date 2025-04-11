import Event from "./Event.js";
import { BlessingWaitressState, CardState } from "../Game/constants.js";
import { globals } from "../index.js";

export default class BlessingWaitressEvent extends Event {
  #state;
  #currentPlayerMinionsInPlayDeck;
  #eventWithoutDurationData;

  constructor(
    executedBy,
    eventCard,
    currentPlayerMinionsInPlayDeck,
    eventWithoutDurationData
  ) {
    super(executedBy, eventCard);

    this.#state = BlessingWaitressState.INIT;
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

    // VARIABLE USED BY THE CORRESPONDING STATE MESSAGE (WHEN IT IS IMPLEMENTED)
    let hpToRestore;

    if (newHP === selectedCard.getInitialHP()) {
      hpToRestore = selectedCard.getInitialHP() - selectedCard.getCurrentHP();
    } else {
      hpToRestore = 30;
    }

    selectedCard.setCurrentHP(newHP);

    this.#eventWithoutDurationData.isActive = false;
    this.#eventWithoutDurationData.instance = {};
  }
}
