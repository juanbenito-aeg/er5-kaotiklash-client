import CardFactory from "./CardFactory.js";
import DeckContainer from "./DeckContainer.js";
import { Category } from "../Game/constants.js";

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
      mainCharacterDeck: [],
      preparationEventsDeck: []
    };

    const player2Decks = {
      handDeck: [],
      minionsInPlayDeck: [],
      minionsDeck: [],
      mainCharacterDeck: [],
      preparationEventsDeck: []
    };

    const eventsDeck = [];

    for (let i = 0; i < mainDeck.cardFactory.length; i++){
        const card = mainDeck.cardFactory[i];
        
        switch(card.Category){
            case Category.MAIN_CHARACTERS:
                    player1Decks.mainCharacterDeck.push(card);
                    player2Decks.mainCharacterDeck.push(card);
                break;
            case Category.MINIONS:
                    player1Decks.minionsDeck.push(card);
                    player2Decks.minionsDeck.push(card);
                break;
            case Category.EVENTS:
                eventsDeck.push(card);
                break;
            case Category.PREPARATION_EVENTS:
                player1Decks.preparationEventsDeck.push(card);
                player2Decks.preparationEventsDeck.push(card);
                break;
            default:
                    player1Decks.handDeck.push(card);
                    player2Decks.handDeck.push(card);
                    break;
        }
    }

    const allDecks = [
        eventsDeck, player1Decks.preparationEventsDeck, player1Decks.handDeck, 
        player1Decks.mainCharacterDeck, player1Decks.minionsDeck, 
        player1Decks.minionsInPlayDeck, player2Decks.preparationEventsDeck,
        player2Decks.handDeck, player2Decks.mainCharacterDeck, 
        player2Decks.minionsDeck, player2Decks.minionsInPlayDeck
    ];
     
    return new DeckContainer(allDecks);
  }
}
