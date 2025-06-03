import Event from "./Event.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";
import {
  CardCategory,
  CardState,
  MainCharacterID,
  StolenFateState,
} from "../Game/constants.js";

export default class StolenFateEvent extends Event {
  #state;
  #phaseMessage;
  #stateMessages;
  #eventWithoutDurationData;
  #eventsDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerCardsInHandGrid;

  constructor(
    executedBy,
    eventCard,
    phaseMessage,
    stateMessages,
    eventWithoutDurationData,
    eventsDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerCardsInHandGrid
  ) {
    super(executedBy, eventCard);

    this.#state = StolenFateState.DISCARD_CARDS;
    this.#phaseMessage = phaseMessage;
    this.#stateMessages = stateMessages;
    this.#eventWithoutDurationData = eventWithoutDurationData;
    this.#eventsDeck = eventsDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerCardsInHandGrid = currentPlayerCardsInHandGrid;
  }

  execute() {
    switch (this.#state) {
      case StolenFateState.DISCARD_CARDS:
        this.#discardCardsInHand();
        break;

      case StolenFateState.DRAW_CARDS:
        this.#drawEventsDeckCards();
        break;
    }
  }

  #discardCardsInHand() {
    if (this.#currentPlayerCardsInHandDeck.getCards().length >= 5) {
      this.#phaseMessage.setCurrentContent(
        PhaseMessage.content.stolenFate.discardCardsInHand[globals.language]
      );

      const hoveredCard =
        this.#currentPlayerCardsInHandDeck.lookForHoveredCard();

      if (hoveredCard) {
        if (!hoveredCard.isLeftClicked()) {
          hoveredCard.setState(CardState.HOVERED);
        } else {
          const selectedCard = hoveredCard;

          const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
            this.#currentPlayerCardsInHandGrid,
            selectedCard
          );
          boxEventCardWasPositionedIn.resetCard();

          this.#eventsDeck.insertCard(selectedCard);
          this.#currentPlayerCardsInHandDeck.removeCard(selectedCard);

          selectedCard.setState(CardState.INACTIVE);
        }
      }
    } else {
      this.#state = StolenFateState.DRAW_CARDS;
    }
  }

  #drawEventsDeckCards() {
    let cardsDrawn = 0;

    for (
      let i = 0;
      i < this.#currentPlayerCardsInHandGrid.getBoxes().length;
      i++
    ) {
      const currentBox = this.#currentPlayerCardsInHandGrid.getBoxes()[i];

      if (!currentBox.isOccupied()) {
        const eventCard = this.#eventsDeck.getCards()[i];

        if (
          eventCard.getCategory() === CardCategory.MAIN_CHARACTER &&
          eventCard.getID() === MainCharacterID.JOSEPH
        ) {
          this.#eventsDeck.shuffle();
          i--;
        } else {
          this.#currentPlayerCardsInHandDeck.insertCard(eventCard);
          this.#eventsDeck.removeCard(eventCard);

          currentBox.setCard(eventCard);

          eventCard.setXCoordinate(currentBox.getXCoordinate());
          eventCard.setYCoordinate(currentBox.getYCoordinate());

          const cardDrawnMsg = new StateMessage(
            "CARD DRAWN!",
            "17px MedievalSharp",
            "yellow",
            1,
            2,
            eventCard.getXCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .width /
                2,
            eventCard.getYCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .height /
                2,
            1,
            new Physics(0, 0)
          );

          cardDrawnMsg.setVY(20);

          this.#stateMessages.push(cardDrawnMsg);

          cardsDrawn++;
          if (cardsDrawn === 2) {
            break;
          }
        }
      }
    }

    this.#eventWithoutDurationData.isActive = false;
    this.#eventWithoutDurationData.instance = {};
  }
}
