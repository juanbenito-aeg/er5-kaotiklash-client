import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import JosephConstantSwapEvent from "../Events/JosephConstantSwapEvent.js";
import { checkIfMusicIsPlayingAndIfSoReset, setMusic } from "../index.js";
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
  Music,
  CardState,
} from "../Game/constants.js";
import Physics from "../Game/Physics.js";

export default class DrawCardPhase extends Phase {
  #isFirstTurn;
  #stateMessages;
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
  #stats;
  #animationCards;
  #eventsGrid;

  constructor(
    state,
    mouseInput,
    phaseMessage,
    stateMessages,
    player,
    events,
    eventsDeck,
    activeEventsDeck,
    josephDeck,
    josephGrid,
    currentPlayerCardsInHandDeck,
    currentPlayerCardsInHandGrid,
    eventsGrid,
    deckContainer,
    board,
    stats,
    animationCards
  ) {
    super(state, mouseInput, phaseMessage);

    this.#isFirstTurn = true;
    this.#stateMessages = stateMessages;
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
    this.#stats = stats;
    this.#animationCards = animationCards;
    this.#eventsGrid = eventsGrid;
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer,
    phaseMessage,
    stateMessages,
    attackMenuData,
    eventsData,
    stats,
    edgeAnimation,
    particles,
    highlightedBoxes,
    animationCards
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

    let eventsGrid = board.getGrids()[GridType.EVENTS_DECK];

    const drawCardPhase = new DrawCardPhase(
      0,
      mouseInput,
      phaseMessage,
      stateMessages,
      player,
      events,
      eventsDeck,
      activeEventsDeck,
      josephDeck,
      josephGrid,
      currentPlayerCardsInHandDeck,
      currentPlayerCardsInHandGrid,
      eventsGrid,
      deckContainer,
      board,
      stats,
      animationCards
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

    const drawnCard = this.#eventsDeck.getCards()[0];

    let boxToPlaceDrawnCardInto;

    if (
      drawnCard.getCategory() === CardCategory.MAIN_CHARACTER &&
      drawnCard.getID() === MainCharacterID.JOSEPH
    ) {
      this.#stats.setJosephAppearedToTrue();

      this.#activeEventsDeck.insertCard(drawnCard);
      this.#josephDeck.insertCard(drawnCard);

      checkIfMusicIsPlayingAndIfSoReset();
      setMusic(Music.JOSEPH_MUSIC);

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
    this.#animationCards.card = drawnCard;
    this.#animationCards.animationTime = 0;
    this.#animationCards.targetBox = boxToPlaceDrawnCardInto;
    this.#animationCards.phase = 0;
    this.#animationCards.flipProgress = 0;

    const eventBox = this.#eventsGrid.getBoxes()[0];
    const startX = eventBox.getXCoordinate();
    const startY = eventBox.getYCoordinate();

    drawnCard.setXCoordinate(startX);
    drawnCard.setYCoordinate(startY);
    drawnCard.setState(CardState.REVEALING_AND_MOVING);

    this.#eventsDeck.removeCard(drawnCard);
    eventBox.resetCard();
  }

  #createAndStoreJosephEvent() {
    const josephConstantSwapEvent = JosephConstantSwapEvent.create(
      this.#player,
      this.#josephDeck,
      this.#deckContainer,
      this.#board,
      this.#events,
      this.#stateMessages
    );

    this.#events.push(josephConstantSwapEvent);

    const josephIsHereMsg = new StateMessage(
      "THE FEARSOME JOSEPH IS HERE!",
      "60px MedievalSharp",
      "rgb(225 213 231)",
      1,
      2,
      globals.canvas.width / 2,
      globals.canvas.height / 2,
      1,
      new Physics(0, 0)
    );

    josephIsHereMsg.setVY(20);

    this.#stateMessages.push(josephIsHereMsg);
  }
}
