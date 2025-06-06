import CardMovement from "../Decks/CardMovement.js";
import Deck from "../Decks/Deck.js";
import {
  CardCategory,
  CardState,
  DeckType,
  MainCharacterID,
} from "../Game/constants.js";

export default class InitialPhase {
  #deckContainer;

  constructor(deckContainer) {
    this.#deckContainer = deckContainer;
  }

  execute() {
    this.#applyCardMovementToAllCards();
    this.#dealMinions();
    this.#dealEventCards();
  }

  #applyCardMovementToAllCards() {
    const updatedDecks = [];

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const updatedDeck = new Deck(i, []);
      updatedDecks.push(updatedDeck);

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        currentCard = new CardMovement(currentCard, CardState.INACTIVE);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }

  #dealMinions() {
    const player1Minions =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];
    const player1MinionsInPlay =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];

    const player2Minions =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];
    const player2MinionsInPlay =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

    player1Minions.shuffle();
    player2Minions.shuffle();

    this.#selectAndInsertCards(player1Minions, player1MinionsInPlay, 3);
    this.#selectAndInsertCards(player2Minions, player2MinionsInPlay, 3);
  }

  #selectAndInsertCards(
    deckToSelectCardsFrom,
    deckToInsertCardsInto,
    numOfCardsToSelectAndInsert
  ) {
    for (let i = 0; i < numOfCardsToSelectAndInsert; i++) {
      const selectedCard = deckToSelectCardsFrom.getCards().shift();
      deckToInsertCardsInto.insertCard(selectedCard);
    }
  }

  #dealEventCards() {
    const eventsDeck = this.#deckContainer.getDecks()[DeckType.EVENTS];
    eventsDeck.shuffle();

    const eventCardsToDealToPlayers = new Deck(-1, []);

    const NUM_OF_CARDS_TO_DEAL = 10;

    for (let i = 0; i < eventsDeck.getCards().length; i++) {
      const currentCard = eventsDeck.getCards()[i];

      if (currentCard.getCategory() !== CardCategory.MAIN_CHARACTER) {
        eventCardsToDealToPlayers.insertCard(currentCard);

        eventsDeck.removeCard(currentCard);

        if (
          eventCardsToDealToPlayers.getCards().length === NUM_OF_CARDS_TO_DEAL
        ) {
          break;
        }
      }
    }

    const playersCardsInHand = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
    ];

    for (let i = 0; i < playersCardsInHand.length; i++) {
      const currentCardsInHand = playersCardsInHand[i];

      this.#selectAndInsertCards(
        eventCardsToDealToPlayers,
        currentCardsInHand,
        5
      );
    }
  }
}
