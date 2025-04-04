import CardMovement from "../Decks/CardMovement.js";
import Deck from "../Decks/Deck.js";
import {
  CardCategory,
  CardState,
  DeckType,
  WeaponTypeID,
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
    const player1MinionsInPlay =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    const player2MinionsInPlay =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    const player1Minions =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];
    const player2Minions =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];

    this.#shuffleDeck(player1Minions.getCards());
    this.#shuffleDeck(player2Minions.getCards());

    this.#selectAndInsertCards(
      player1Minions.getCards(),
      player1MinionsInPlay,
      3
    );
    this.#selectAndInsertCards(
      player2Minions.getCards(),
      player2MinionsInPlay,
      3
    );
  }

  #shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      const temp = deck[i];
      deck[i] = deck[randomIndex];
      deck[randomIndex] = temp;
    }
  }

  #selectAndInsertCards(minionsDeck, minionsInPlayDeck, numCards) {
    let selectedMinions = [];

    for (let i = 0; i < numCards; i++) {
      const selectedMinion = minionsDeck.splice(i, 1)[0];
      selectedMinions.push(selectedMinion);
    }

    for (let i = 0; i < selectedMinions.length; i++) {
      minionsInPlayDeck.insertCard(selectedMinions[i]);
    }
  }

  #dealEventCards() {
    const player1CardsInHand =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];
    const player2CardsInHand =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];

    const eventDeck = this.#deckContainer.getDecks()[DeckType.EVENTS];
    const eventCards = eventDeck.getCards();

    const eventWeapon = [];

    for (let i = 0; i < eventCards.length; i++) {
      const currentCard = eventCards[i];
      if (currentCard.getCategory() === CardCategory.WEAPON) {
        eventWeapon.push(currentCard);
      }
    }

    this.#shuffleDeck(eventWeapon);

    this.#selectAndInsertCards(eventWeapon, player1CardsInHand, 5);
    this.#selectAndInsertCards(eventWeapon, player2CardsInHand, 5);
  }
}
