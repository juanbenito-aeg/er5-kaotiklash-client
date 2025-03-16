import CardFactory from "./CardFactory.js";
import Deck from "./Deck.js";
import DeckContainer from "./DeckContainer.js";
import { CardCategory, DeckType, MainCharacterID } from "../Game/constants.js";

export default class DeckCreator {
  #mainDeckConfig;

  constructor(mainDeckConfig) {
    this.#mainDeckConfig = mainDeckConfig;
  }

  createMainDeck() {
    const mainDeck = new Deck(DeckType.MAIN, []);

    const cardFactory = new CardFactory();

    for (const cardCategory in this.#mainDeckConfig) {
      const currentCategoryCards = this.#mainDeckConfig[cardCategory];

      for (let i = 0; i < currentCategoryCards.length; i++) {
        const currentCardID = currentCategoryCards[i].card_id;
        const currentCardQuantity = currentCategoryCards[i].quantity;

        for (let j = 0; j < currentCardQuantity; j++) {
          const currentCard = cardFactory.createCard(
            currentCardID,
            cardCategory
          );
          mainDeck.insertCard(currentCard);
        }
      }
    }

    const deckContainer = new DeckContainer([mainDeck]);
    return deckContainer;
  }

  createAllDecks(mainDeck) {
    // CREATION OF DECKS THAT DO NOT BELONG TO ANY PARTICULAR PLAYER
    const events = new Deck(DeckType.EVENTS, []);
    const joseph = new Deck(DeckType.JOSEPH, []);

    // CREATION OF PLAYER 1'S DECKS
    const player1MainCharacter = new Deck(DeckType.PLAYER_1_MAIN_CHARACTER, []);
    const player1CardsInHand = new Deck(DeckType.PLAYER_1_CARDS_IN_HAND, []);
    const player1Minions = new Deck(DeckType.PLAYER_1_MINIONS, []);
    const player1MinionsInPlay = new Deck(
      DeckType.PLAYER_1_MINIONS_IN_PLAY,
      []
    );
    const player1EventsInPreparation = new Deck(
      DeckType.PLAYER_1_EVENTS_IN_PREPARATION,
      []
    );
    const player1ActiveEvents = new Deck(DeckType.PLAYER_1_ACTIVE_EVENTS, []);

    // CREATION OF PLAYER 2'S DECKS
    const player2MainCharacter = new Deck(DeckType.PLAYER_2_MAIN_CHARACTER, []);
    const player2CardsInHand = new Deck(DeckType.PLAYER_2_CARDS_IN_HAND, []);
    const player2Minions = new Deck(DeckType.PLAYER_2_MINIONS, []);
    const player2MinionsInPlay = new Deck(
      DeckType.PLAYER_2_MINIONS_IN_PLAY,
      []
    );
    const player2EventsInPreparation = new Deck(
      DeckType.PLAYER_2_EVENTS_IN_PREPARATION,
      []
    );
    const player2ActiveEvents = new Deck(DeckType.PLAYER_2_ACTIVE_EVENTS, []);

    // DETERMINE WHICH MAIN CHARACTERS WILL BE DEALT TO THE PLAYERS
    const randomMainCharacterIDs = [-1, -1];
    randomMainCharacterIDs[0] = Math.floor(Math.random() * 4);
    randomMainCharacterIDs[1] = Math.floor(Math.random() * 4);
    while (randomMainCharacterIDs[0] === randomMainCharacterIDs[1]) {
      randomMainCharacterIDs[1] = Math.floor(Math.random() * 4);
    }

    let numOfDealtMainCharacters = 0;
    let numOfDealtMinions = 0;

    for (let i = 0; i < mainDeck.getCards().length; i++) {
      const card = mainDeck.getCards()[i];

      if (
        card.getCategory() === CardCategory.MAIN_CHARACTER &&
        card.getID() !== MainCharacterID.JOSEPH
      ) {
        if (
          numOfDealtMainCharacters === 0 &&
          (card.getID() === randomMainCharacterIDs[0] ||
            card.getID() === randomMainCharacterIDs[1])
        ) {
          player1MainCharacter.insertCard(card);
          numOfDealtMainCharacters++;
        } else if (
          numOfDealtMainCharacters === 1 &&
          (card.getID() === randomMainCharacterIDs[0] ||
            card.getID() === randomMainCharacterIDs[1])
        ) {
          player2MainCharacter.insertCard(card);
        }
      } else if (card.getCategory() === CardCategory.MINION) {
        if (numOfDealtMinions % 2 === 0) {
          player1Minions.insertCard(card);
        } else {
          player2Minions.insertCard(card);
        }
        numOfDealtMinions++;
      } else {
        // CARD CATEGORY -> EVENT
        events.insertCard(card);
      }
    }

    const deckContainer = new DeckContainer([
      events,
      joseph,
      player1MainCharacter,
      player1CardsInHand,
      player1Minions,
      player1MinionsInPlay,
      player1EventsInPreparation,
      player1ActiveEvents,
      player2MainCharacter,
      player2CardsInHand,
      player2Minions,
      player2MinionsInPlay,
      player2EventsInPreparation,
      player2ActiveEvents,
    ]);
    return deckContainer;
  }
}
