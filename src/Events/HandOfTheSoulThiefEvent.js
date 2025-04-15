import { CardState, HandOfTheSoulThiefState } from "../Game/constants.js";
import Event from "./Event.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import { globals } from "../index.js";

export default class HandOfTheSoulThiefEvent extends Event {
  #currentPlayerCardsInHandDeck;
  #currentPlayerCardsInHandGrid;
  #eventWithoutDurationData;
  #enemyCardsInHandDeck;
  #enemyCardsInHandGrid;
  #phaseMessage;
  #stateMessage;
  #state;

  constructor(
    executeBy,
    eventCard,
    currentPlayerCardsInHandDeck,
    currentPlayerCardsInHandGrid,
    enemyCardsInHandDeck,
    enemyCardsInHandGrid,
    phaseMesssage,
    stateMessage,
    eventWithoutDurationData
  ) {
    super(executeBy, eventCard);
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerCardsInHandGrid = currentPlayerCardsInHandGrid;
    this.#enemyCardsInHandDeck = enemyCardsInHandDeck;
    this.#enemyCardsInHandGrid = enemyCardsInHandGrid;
    this.#state = HandOfTheSoulThiefState.INIT;
    this.#phaseMessage = phaseMesssage;
    this.#stateMessage = stateMessage;
    this.#eventWithoutDurationData = eventWithoutDurationData;
  }

  execute() {
    switch (this.#state) {
      case HandOfTheSoulThiefState.INIT:
        this.#initiEvent();
        break;
      case HandOfTheSoulThiefState.SELECT_ENEMY_CARD_TO_STEAL:
        this.#selectEnemyCardToSteal();
        break;
      case HandOfTheSoulThiefState.SELECT_CARD_TO_EXCHANGE:
        this.#selectCardInHandToExchange();
        break;
      case HandOfTheSoulThiefState.END:
        this.#insertStealCard();
        break;
    }
  }

  #initiEvent() {
    this.#state = HandOfTheSoulThiefState.SELECT_ENEMY_CARD_TO_STEAL;
  }

  #selectEnemyCardToSteal() {
    this.#phaseMessage.setCurrentContent(
      PhaseMessage.content.handOfTheSoulThief.selectEnemyCard[globals.language]
    );

    const hoveredEnemyCard = this.#enemyCardsInHandDeck.lookForHoveredCard();

    if (hoveredEnemyCard) {
      if (!hoveredEnemyCard.isLeftClicked()) {
        hoveredEnemyCard.setState(CardState.HOVERED);
      } else {
        hoveredEnemyCard.setState(CardState.SELECTED);
        let message = new StateMessage(
          "YOU HAVE STOLEN A CARD FROM YOUR ENEMY'S SOUL!",
          "38px MedievalSharp",
          "crimson",
          2,
          1200,
          530
        );
        this.#stateMessage.push(message);
        this.#state = HandOfTheSoulThiefState.SELECT_CARD_TO_EXCHANGE;
      }
    }
  }

  #selectCardInHandToExchange() {
    this.#phaseMessage.setCurrentContent(
      PhaseMessage.content.handOfTheSoulThief.selectCardInHand[globals.language]
    );

    const hoveredCard = this.#currentPlayerCardsInHandDeck.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);
        this.#state = HandOfTheSoulThiefState.END;
      }
    }
  }

  #insertStealCard() {
    const selectedCard =
      this.#currentPlayerCardsInHandDeck.lookForSelectedCard();

    const selectedEnemyCard = this.#enemyCardsInHandDeck.lookForSelectedCard();

    if (
      selectedCard.getState() === CardState.SELECTED &&
      selectedEnemyCard.getState() === CardState.SELECTED
    ) {
      this.#currentPlayerCardsInHandDeck.removeCard(selectedCard);
      this.#enemyCardsInHandDeck.removeCard(selectedEnemyCard);

      this.#currentPlayerCardsInHandDeck.insertCard(selectedEnemyCard);
      this.#enemyCardsInHandDeck.insertCard(selectedCard);

      const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
        this.#currentPlayerCardsInHandGrid,
        selectedCard
      );

      const enemyBoxEventCardWasPositionedIn =
        selectedEnemyCard.getBoxIsPositionedIn(
          this.#enemyCardsInHandGrid,
          selectedEnemyCard
        );

      boxEventCardWasPositionedIn.resetCard();
      enemyBoxEventCardWasPositionedIn.resetCard();

      selectedEnemyCard.setXCoordinate(
        boxEventCardWasPositionedIn.getXCoordinate()
      );
      selectedEnemyCard.setYCoordinate(
        boxEventCardWasPositionedIn.getYCoordinate()
      );

      selectedCard.setXCoordinate(
        enemyBoxEventCardWasPositionedIn.getXCoordinate()
      );
      selectedCard.setYCoordinate(
        enemyBoxEventCardWasPositionedIn.getYCoordinate()
      );

      boxEventCardWasPositionedIn.setCard(selectedEnemyCard);
      enemyBoxEventCardWasPositionedIn.setCard(selectedCard);

      selectedCard.setState(CardState.PLACED);
      selectedEnemyCard.setState(CardState.PLACED);

      let message = new StateMessage(
        "THE CARDS HAVE BEEN SUCCESSFULLY EXCHANGED!",
        "40px MedievalSharp",
        "blue",
        3,
        1200,
        570
      );

      this.#stateMessage.push(message);

      this.#eventWithoutDurationData.isActive = false;
      this.#eventWithoutDurationData.instance = {};
    }
  }
}
