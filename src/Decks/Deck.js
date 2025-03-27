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

  removeCard(card) {
    const indexOfCardToRemove = this.#cards.indexOf(card);

    this.#cards.splice(indexOfCardToRemove, 1);
  }

  lookForHoveredCard() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.isMouseOver()) {
        return currentCard;
      }
    }
  }

  lookForCardThatIsntHoveredAnymore() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (
        currentCard.getState() === CardState.HOVERED &&
        !currentCard.isMouseOver()
      ) {
        return currentCard;
      }
    }
  }

  lookForLeftClickedCard() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.isLeftClicked()) {
        return currentCard;
      }
    }
  }

  lookForSelectedCard() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.getState() === CardState.SELECTED) {
        return currentCard;
      }
    }
  }

  checkIfAnyCardIsExpanded() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.getState() === CardState.EXPANDED) {
        return true;
      }
    }
  }

  checkIfAnyCardIsSelected() {
    for (let i = 0; i < this.getCards().length; i++) {
      const currentCard = this.getCards()[i];

      if (currentCard.getState() === CardState.SELECTED) {
        return true;
      }
    }
  }
}
