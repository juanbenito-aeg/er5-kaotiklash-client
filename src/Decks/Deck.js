import { CardState } from "../Game/constants.js";

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
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      const isMouseWithinCardWidth =
        mouseInput.getMouseXCoordinate() >= currentCard.getXCoordinate() &&
        mouseInput.getMouseXCoordinate() <= currentCard.getXCoordinate() + 110;

      const isMouseWithinCardHeight =
        mouseInput.getMouseYCoordinate() >= currentCard.getYCoordinate() &&
        mouseInput.getMouseYCoordinate() <= currentCard.getYCoordinate() + 110;

      if (isMouseWithinCardWidth && isMouseWithinCardHeight) {
        if (currentCard.getState() === CardState.INACTIVE) {
          currentCard.setState(CardState.INACTIVE_HOVERED);
        } else if (currentCard.getState() === CardState.PLACED) {
          currentCard.setState(CardState.HOVERED);
        }
      }
    }
  }
}
