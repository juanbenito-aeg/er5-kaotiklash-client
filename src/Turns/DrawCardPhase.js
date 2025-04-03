import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import {
  CardState,
  DeckType,
  PlayerID,
  CardCategory,
  GridType,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class DrawCardPhase extends Phase {
  #decksRelevants;
  #gridsRelevants;
  #isFirstTurn;
  #filteredCards;

  constructor(state, mouseInput, phaseMessage, decksRelevants, gridsRelevants) {
    super(state, mouseInput, phaseMessage);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridsRelevants;
    this.#isFirstTurn = true;
    this.#filteredCards = [];
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer,
    phaseMessage
  ) {
    let decksRelevants;
    let gridsRelevants;

    decksRelevants = [
      deckContainer.getDecks()[DeckType.EVENTS],
      player.getID() === PlayerID.PLAYER_1
        ? deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND]
        : deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
    ];
    gridsRelevants = [
      player === currentPlayer
        ? board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND]
        : board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND],
    ];

    const drawCardPhase = new DrawCardPhase(
      0,
      mouseInput,
      phaseMessage,
      decksRelevants,
      gridsRelevants
    );

    return drawCardPhase;
  }

  execute() {
    let isPhaseFinished = false;

    if (this.#isFirstTurn) {
      this.#isFirstTurn = false;
    } else {
      this._phaseMessage.setCurrentContent(
        PhaseMessage.content.drawCard.subsequentDraw[globals.language]
      );

      this.#filterEventDeck();

      if (this.#filteredCards.length > 0) {
        this.#assignCards();
      }

      this.#filteredCards = [];
    }

    isPhaseFinished = true;

    return isPhaseFinished;
  }

  #filterEventDeck() {
    const eventDeck = this.#decksRelevants[0];
    const eventCards = eventDeck.getCards();

    for (let i = 0; i < eventCards.length; i++) {
      const card = eventCards[i];

      if (card.getCategory() === CardCategory.WEAPON) {
        this.#filteredCards.push(card);

        eventDeck.removeCard(card);
      }
    }
  }

  #assignCards() {
    const handDeck = this.#decksRelevants[1];
    const handGrid = this.#gridsRelevants[0];

    const randomIndex = Math.floor(Math.random() * this.#filteredCards.length);
    const selectedCard = this.#filteredCards[randomIndex];

    handDeck.insertCard(selectedCard);

    for (let i = 0; i < handGrid.getBoxes().length; i++) {
      const box = handGrid.getBoxes()[i];

      if (!box.getCard()) {
        selectedCard.setXCoordinate(box.getXCoordinate());
        selectedCard.setYCoordinate(box.getYCoordinate());

        selectedCard.setState(CardState.PLACED);
        box.setCard(selectedCard);

        break;
      }
    }
  }
}
