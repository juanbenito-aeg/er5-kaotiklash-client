import { CardCategory, CardState } from "../Game/constants.js";
import { globals } from "../index.js";

export default class Deck {
  #deckType;
  #cards;

  constructor(deckType, cards) {
    this.#deckType = deckType;
    this.#cards = cards;
  }

  getDeckType() {
    return this.#deckType;
  }

  getCards() {
    return this.#cards;
  }

  insertCard(card) {
    this.#cards.push(card);
  }

  checkIfMouseOverAnyCard(mouseInput) {
    const hoveredCardData = {
      isAnyCardHovered: false,
      hoveredCard: null,
    };

    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      let currentCardWidth =
        globals.imagesDestinationSizes.allCardsBigVersion.width;
      let currentCardHeight =
        globals.imagesDestinationSizes.allCardsBigVersion.height;

      let currentCardXCoordinate =
        globals.canvas.width / 2 - currentCardWidth / 2;
      let currentCardYCoordinate =
        globals.canvas.height / 2 - currentCardHeight / 2;

      if (currentCard.getState() !== CardState.EXPANDED) {
        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          currentCardWidth =
            globals.imagesDestinationSizes.mainCharactersSmallVersion.width;
          currentCardHeight =
            globals.imagesDestinationSizes.mainCharactersSmallVersion.height;
        } else {
          currentCardWidth =
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
          currentCardHeight =
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;
        }

        currentCardXCoordinate = currentCard.getXCoordinate();
        currentCardYCoordinate = currentCard.getYCoordinate();
      }

      const isMouseWithinCardWidth =
        mouseInput.getMouseXCoordinate() >= currentCardXCoordinate &&
        mouseInput.getMouseXCoordinate() <=
          currentCardXCoordinate + currentCardWidth;

      const isMouseWithinCardHeight =
        mouseInput.getMouseYCoordinate() >= currentCardYCoordinate &&
        mouseInput.getMouseYCoordinate() <=
          currentCardYCoordinate + currentCardHeight;

      if (isMouseWithinCardWidth && isMouseWithinCardHeight) {
        hoveredCardData.isAnyCardHovered = true;
        hoveredCardData.hoveredCard = currentCard;

        if (currentCard.getState() === CardState.INACTIVE) {
          currentCard.setPreviousState(CardState.INACTIVE);
          currentCard.setState(CardState.INACTIVE_HOVERED);
        } else if (currentCard.getState() === CardState.PLACED) {
          currentCard.setPreviousState(CardState.PLACED);
          currentCard.setState(CardState.HOVERED);
        }
      } else if (
        (!isMouseWithinCardWidth || !isMouseWithinCardHeight) &&
        (currentCard.getState() === CardState.INACTIVE_HOVERED ||
          currentCard.getState() === CardState.HOVERED)
      ) {
        currentCard.setState(currentCard.getPreviousState());
      }
    }

    return hoveredCardData;
  }

  checkIfAnyCardIsExpanded() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.getState() === CardState.EXPANDED) {
        return true;
      }
    }

    return false;
  }
}
