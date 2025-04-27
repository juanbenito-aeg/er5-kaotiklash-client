import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import JosephConstantSwapEvent from "../Events/JosephConstantSwapEvent.js";
import globals from "../Game/globals.js";
import {
  DeckType,
  PlayerID,
  CardCategory,
  GridType,
  SpecialEventID,
  RareEventID,
  MainCharacterID,
  ArmorID,
} from "../Game/constants.js";

export default class DrawCardPhase extends Phase {
  #isFirstTurn;
  #player;
  #events;
  #eventsDeck;
  #activeEventsDeck;
  #josephDeck;
  #josephGrid;
  #currentPlayerCardsInHandDeck;
  #currentPlayerCardsInHandGrid;
  #deckContainer;
  #board;

  constructor(
    state,
    mouseInput,
    phaseMessage,
    player,
    events,
    eventsDeck,
    activeEventsDeck,
    josephDeck,
    josephGrid,
    currentPlayerCardsInHandDeck,
    currentPlayerCardsInHandGrid,
    deckContainer,
    board
  ) {
    super(state, mouseInput, phaseMessage);

    this.#isFirstTurn = true;
    this.#player = player;
    this.#events = events;
    this.#eventsDeck = eventsDeck;
    this.#activeEventsDeck = activeEventsDeck;
    this.#josephDeck = josephDeck;
    this.#josephGrid = josephGrid;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerCardsInHandGrid = currentPlayerCardsInHandGrid;
    this.#deckContainer = deckContainer;
    this.#board = board;
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
    // DECKS VARIABLES
    const eventsDeck = deckContainer.getDecks()[DeckType.EVENTS];
    const activeEventsDeck = deckContainer.getDecks()[DeckType.ACTIVE_EVENTS];
    const josephDeck = deckContainer.getDecks()[DeckType.JOSEPH];
    let currentPlayerCardsInHandDeck =
      player.getID() === PlayerID.PLAYER_1
        ? deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND]
        : deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];

    // GRIDS VARIABLES
    const josephGrid = board.getGrids()[GridType.JOSEPH];
    let currentPlayerCardsInHandGrid =
      player === currentPlayer
        ? board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND]
        : board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND];

    const drawCardPhase = new DrawCardPhase(
      0,
      mouseInput,
      phaseMessage,
      player,
      events,
      eventsDeck,
      activeEventsDeck,
      josephDeck,
      josephGrid,
      currentPlayerCardsInHandDeck,
      currentPlayerCardsInHandGrid,
      deckContainer,
      board
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

      this.#drawCard();
    }

    isPhaseFinished = true;

    return isPhaseFinished;
  }

  #drawCard() {
    this.#eventsDeck.shuffle();

    // (!) UNCOMMENT WHEN CARDS TESTING FINISHES
    // const drawnCard = this.#eventsDeck.getCards()[0];

    // (!) REMOVE WHEN CARDS TESTING FINISHES
    const drawnCard = this.#getSpecifiedCard(
      CardCategory.ARMOR,
      ArmorID.ARMOR_OF_TITANIC_FURY
    );
    if (!drawnCard) {
      return;
    }

    let boxToPlaceDrawnCardInto;

    if (
      drawnCard.getCategory() === CardCategory.MAIN_CHARACTER &&
      drawnCard.getID() === MainCharacterID.JOSEPH
    ) {
      this.#activeEventsDeck.insertCard(drawnCard);
      this.#josephDeck.insertCard(drawnCard);

      boxToPlaceDrawnCardInto = this.#josephGrid.getBoxes()[0];

      this.#createAndStoreJosephEvent();
    } else {
      this.#currentPlayerCardsInHandDeck.insertCard(drawnCard);

      for (
        let i = 0;
        i < this.#currentPlayerCardsInHandGrid.getBoxes().length;
        i++
      ) {
        const box = this.#currentPlayerCardsInHandGrid.getBoxes()[i];

        if (!box.getCard()) {
          boxToPlaceDrawnCardInto = box;

          break;
        }
      }
    }

    drawnCard.setXCoordinate(boxToPlaceDrawnCardInto.getXCoordinate());
    drawnCard.setYCoordinate(boxToPlaceDrawnCardInto.getYCoordinate());

    boxToPlaceDrawnCardInto.setCard(drawnCard);

    this.#eventsDeck.removeCard(drawnCard);
  }

  // (!) REMOVE WHEN CARDS TESTING FINISHES
  #getSpecifiedCard(cardCategory, cardID) {
    for (let i = 0; i < this.#eventsDeck.getCards().length; i++) {
      const card = this.#eventsDeck.getCards()[i];

      if (card.getCategory() === cardCategory && card.getID() === cardID) {
        return card;
      }
    }
  }

  #createAndStoreJosephEvent() {
    const josephConstantSwapEvent = JosephConstantSwapEvent.create(
      this.#player,
      this.#josephDeck,
      this.#deckContainer,
      this.#board,
      this.#events
    );

    this.#events.push(josephConstantSwapEvent);
  }
}
