import CardFactory from "./CardFactory.js";
import DeckContainer from "./DeckContainer.js";

export default class DeckCreator {
  #cardsData;
  #mainDeckConfig;

  constructor(cardsData, mainDeckConfig) {
    this.#cardsData = cardsData;
    this.#mainDeckConfig = mainDeckConfig;
  }

  createMainDeck() {
    const mainDeck = [];
    const cardFactory = new CardFactory(this.#cardsData);

    for (let i = 0; i < this.#mainDeckConfig.length; i++) {
      const cardId = this.#mainDeckConfig[i];
      cardFactory.createCard(cardId);
      mainDeck.push(cardFactory);
    }

    return new DeckContainer(mainDeck);
  }

  createAllDecks(mainDeck) {
    const player1Decks = {
      handDeck: [],
      minionsInPlayDeck: [],
      minionsDeck: [],
      eventPreparationDeck: [],
      mainCharacterDeck: [],
    };

    const player2Decks = {
      handDeck: [],
      minionsInPlayDeck: [],
      minionsDeck: [],
      eventPreparationDeck: [],
      mainCharacterDeck: [],
    };

    const eventsDeck = [];
  }
}
