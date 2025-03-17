import CardMovement from "../Decks/CardMovement.js";
import Deck from "../Decks/Deck.js";
import { CardState } from "../Game/constants.js";

export default class Phase {
  #state;
  #deckContainer;
  #board;
  #mouseInput;
  #decksRelevantToPhase;
  #gridsRelevantToPhase;

  constructor(state, deckContainer, board, mouseInput) {
    this.#state = state;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.#decksRelevantToPhase = [];
    this.#gridsRelevantToPhase = [];
  }

  execute() {}

  addDeck(newDeck) {
    this.#decksRelevantToPhase.push(newDeck);
  }

  addGrid(newGrid) {
    this.#gridsRelevantToPhase.push(newGrid);
  }

  applyCardMovementToAllCards() {
    const updatedDecks = [];

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const updatedDeck = new Deck(i, []);
      updatedDecks.push(updatedDeck);

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        currentCard = new CardMovement(currentCard, CardState.NOT_SELECTED);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }

  handleRightClickOnCard() {
    if (this.#mouseInput.isRightButtonPressed()) {
      for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
        const currentDeck = this.#deckContainer.getDecks()[i];

        for (let j = 0; j < currentDeck.getCards().length; j++) {
          let currentCard = currentDeck.getCards()[j];

          const isMouseWithinCardWidth =
            this.#mouseInput.getMouseXCoordinate() >=
              currentCard.getXCoordinate() &&
            this.#mouseInput.getMouseXCoordinate() <=
              currentCard.getXCoordinate() + currentCard.getCurrentWidth();

          const isMouseWithinCardHeight =
            this.#mouseInput.getMouseYCoordinate() >=
              currentCard.getYCoordinate() &&
            this.#mouseInput.getMouseYCoordinate() <=
              currentCard.getYCoordinate() + currentCard.getCurrentHeight();

          if (isMouseWithinCardWidth && isMouseWithinCardHeight) {
            currentCard.setCurrentWidth(currentCard.getBigVersionWidth());
            currentCard.setCurrentHeight(currentCard.getBigVersionHeight());
          }
        }
      }
    }
  }
}
