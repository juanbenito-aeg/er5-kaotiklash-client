import Event from "./Event.js";
import {
  EchoOfTheStratagenState,
  BoxState,
  CardState,
} from "../Game/constants.js";
import StateMessage from "../Messages/StateMessage.js";
export default class EchoOfTheStratagenEvent extends Event {
  #currentPlayerPrepEventDeck;
  #enemyPrepEventDeck;
  #currentPlayerPrepEventGrid;
  #enemyPrepEventGrid;
  #state;
  #stateMessages;
  #eventWithoutDurationData;

  constructor(
    executeBy,
    eventCard,
    currentPlayerPrepEventDeck,
    enemyPrepEventDeck,
    currentPlayerPrepEventGrid,
    enemyPrepEventGrid,
    stateMessages,
    eventWithoutDurationData
  ) {
    super(executeBy, eventCard);
    this.#currentPlayerPrepEventDeck = currentPlayerPrepEventDeck;
    this.#enemyPrepEventDeck = enemyPrepEventDeck;
    this.#currentPlayerPrepEventGrid = currentPlayerPrepEventGrid;
    this.#enemyPrepEventGrid = enemyPrepEventGrid;
    this.#state = EchoOfTheStratagenState.INIT;
    this.#stateMessages = stateMessages;
    this.#eventWithoutDurationData = eventWithoutDurationData;
  }

  execute() {
    switch (this.#state) {
      case EchoOfTheStratagenState.INIT:
        this.#initEvent();
        break;
      case EchoOfTheStratagenState.SELECT_ENEMY_PREP_EVENT:
        this.#selectEnemyPrepEvent();
        break;
      case EchoOfTheStratagenState.END:
        this.#insertEnemyEvent();
        break;
    }
  }

  #initEvent() {
    this.#state = EchoOfTheStratagenState.SELECT_ENEMY_PREP_EVENT;
  }

  #selectEnemyPrepEvent() {
    const hoveredCard = this.#enemyPrepEventDeck.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);
      }
    }
  }

  #insertEnemyEvent() {
    const selectedCard = this.#enemyPrepEventDeck.lookForSelectedCard();

    if (selectedCard.getState() === CardState.SELECTED) {
      for (
        let i = 0;
        i < this.#currentPlayerPrepEventGrid.getBoxes().length;
        i++
      ) {
        const boxes = this.#currentPlayerPrepEventGrid.getBoxes()[i];

        if (!boxes.isOccupied()) {
          this.#currentPlayerPrepEventDeck.insertCard(selectedCard);
          this.#enemyPrepEventDeck.removeCard(selectedCard);

          const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
            this.#enemyPrepEventGrid,
            selectedCard
          );
          boxEventCardWasPositionedIn.resetCard();

          boxes.setCard(selectedCard);

          selectedCard.setCurrentPrepTimeInRounds(2);

          selectedCard.setXCoordinate(boxes.getXCoordinate());
          selectedCard.setYCoordinate(boxes.getYCoordinate());

          boxes.setState(BoxState.OCCUPIED);

          let message = new StateMessage(
            "YOU HAVE STOLEN THE EVENT CORRECTLY",
            "30px MedievalSharp",
            "white",
            3,
            selectedCard.getXCoordinate(),
            selectedCard.getYCoordinate()
          );
          this.#stateMessages.push(message);
        } else {
          let message = new StateMessage(
            "NOT AVIABLE BOX TO INSERT",
            "20px MedievalSharp",
            "red",
            2,
            boxes.getXCoordinate(),
            boxes.getYCoordinate()
          );

          this.#stateMessages.push(message);

          this.#state = EchoOfTheStratagenState.INIT;
        }
      }
    }
    this.#eventWithoutDurationData.isActive = false;
    this.#eventWithoutDurationData.instance = {};
  }
}
