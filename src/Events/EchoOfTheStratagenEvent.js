import Event from "./Event.js";
import globals from "../Game/globals.js";
import PrepareEvent from "./PrepareEvent.js";
import StateMessage from "../Messages/StateMessage.js";
import {
  EchoOfTheStratagenState,
  BoxState,
  CardState,
} from "../Game/constants.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import Physics from "../Game/Physics.js";

export default class EchoOfTheStratagenEvent extends Event {
  #currentPlayerPrepEventDeck;
  #enemyPrepEventDeck;
  #currentPlayerPrepEventGrid;
  #enemyPrepEventGrid;
  #state;
  #stateMessages;
  #phaseMessage;
  #eventWithoutDurationData;
  #events;

  constructor(
    executeBy,
    eventCard,
    currentPlayerPrepEventDeck,
    enemyPrepEventDeck,
    currentPlayerPrepEventGrid,
    enemyPrepEventGrid,
    stateMessages,
    eventWithoutDurationData,
    events,
    phaseMessage
  ) {
    super(executeBy, eventCard);

    this.#currentPlayerPrepEventDeck = currentPlayerPrepEventDeck;
    this.#enemyPrepEventDeck = enemyPrepEventDeck;
    this.#currentPlayerPrepEventGrid = currentPlayerPrepEventGrid;
    this.#enemyPrepEventGrid = enemyPrepEventGrid;
    this.#state = EchoOfTheStratagenState.INIT;
    this.#stateMessages = stateMessages;
    this.#eventWithoutDurationData = eventWithoutDurationData;
    this.#events = events;
    this.#phaseMessage = phaseMessage;
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
    this.#phaseMessage.setCurrentContent(
      PhaseMessage.content.echoOfTheStratagen.selectEnemyCard[globals.language]
    );

    const hoveredCard = this.#enemyPrepEventDeck.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);
        this.#state = EchoOfTheStratagenState.END;
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

          this.#resetSelectedCardFromEnemyGrid(selectedCard);

          boxes.setCard(selectedCard);

          selectedCard.setCurrentPrepTimeInRounds(2);
          selectedCard.setXCoordinate(boxes.getXCoordinate());
          selectedCard.setYCoordinate(boxes.getYCoordinate());

          boxes.setState(BoxState.OCCUPIED);

          this.#deleteOldAndCreateNewPrepareEvent(selectedCard);

          let message = new StateMessage(
            "YOU HAVE STOLEN THE EVENT CORRECTLY",
            "30px MedievalSharp",
            "red",
            1,
            2,
            selectedCard.getXCoordinate(),
            selectedCard.getYCoordinate(),
            1,
            new Physics(0, 0)
          );

          message.setVY(20);

          this.#stateMessages.push(message);

          break;
        } else {
          this.#state = EchoOfTheStratagenState.INIT;
        }
      }
    }
    this.#eventWithoutDurationData.isActive = false;
    this.#eventWithoutDurationData.instance = {};
  }

  #resetSelectedCardFromEnemyGrid(selectedCard) {
    const enemyBoxes = this.#enemyPrepEventGrid.getBoxes();
    for (let j = 0; j < enemyBoxes.length; j++) {
      const enemyBox = enemyBoxes[j];
      if (enemyBox.getCard() === selectedCard) {
        enemyBox.resetCard();
        break;
      }
    }
  }

  #deleteOldAndCreateNewPrepareEvent(selectedCard) {
    for (let i = 0; i < this.#events.length; i++) {
      const currentEvent = this.#events[i];

      if (
        currentEvent.getEventCard() === selectedCard &&
        currentEvent instanceof PrepareEvent
      ) {
        this.#events.splice(i, 1);
      }
    }

    const newPrepareEvent = PrepareEvent.create(this._executedBy, selectedCard);
    this.#events.push(newPrepareEvent);
  }
}
