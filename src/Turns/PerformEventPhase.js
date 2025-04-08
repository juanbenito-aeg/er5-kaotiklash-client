import Phase from "./Phase.js";
import SummonCharacterEvent from "../Events/SummonCharacterEvent.js";
import {
  CardCategory,
  CardState,
  DeckType,
  PerformEventState,
  PlayerID,
  GridType,
  SpecialEventID,
} from "../Game/constants.js";

export default class PerformEventPhase extends Phase {
  #events;
  #eventsDeck;
  #activeEventsDeck;
  #currentPlayerMainCharacterDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyBattleFieldGrid;
  #enemyMinionsInPlayDeck;
  #currentPlayer;

  constructor(
    state,
    mouseInput,
    phaseMessage,
    events,
    eventsDeck,
    activeEventsDeck,
    currentPlayerMainCharacterDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerEventsInPrepDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyBattleFieldGrid,
    enemyMinionsInPlayDeck,
    currentPlayer
  ) {
    super(state, mouseInput, phaseMessage);

    this.#events = events;
    this.#eventsDeck = eventsDeck;
    this.#activeEventsDeck = activeEventsDeck;
    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyBattleFieldGrid = enemyBattleFieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#currentPlayer = currentPlayer;
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
    const eventsDeck = deckContainer.getDecks()[DeckType.EVENTS];
    const activeEventsDeck = deckContainer.getDecks()[DeckType.ACTIVE_EVENTS];
    let currentPlayerMainCharacterDeck;
    let currentPlayerCardsInHandDeck;
    let currentPlayerEventsInPrepDeck;
    let currentPlayerMinionsInPlayDeck;
    let enemyMinionsInPlayDeck;

    if (player.getID() === PlayerID.PLAYER_1) {
      currentPlayerMainCharacterDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MAIN_CHARACTER];

      currentPlayerCardsInHandDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];

      currentPlayerEventsInPrepDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION];

      currentPlayerMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];

      enemyMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    } else {
      currentPlayerMainCharacterDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MAIN_CHARACTER];

      currentPlayerCardsInHandDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];

      currentPlayerEventsInPrepDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION];

      currentPlayerMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

      enemyMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    }

    let currentPlayerEventsInPrepGrid;
    let currentPlayerBattlefieldGrid;
    let enemyBattleFieldGrid;

    if (player === currentPlayer) {
      currentPlayerEventsInPrepGrid =
        board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];

      currentPlayerBattlefieldGrid =
        board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];

      enemyBattleFieldGrid = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    } else {
      currentPlayerEventsInPrepGrid =
        board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];

      currentPlayerBattlefieldGrid =
        board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];

      enemyBattleFieldGrid = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    }

    const performEventPhase = new PerformEventPhase(
      PerformEventState.INIT,
      mouseInput,
      phaseMessage,
      events,
      eventsDeck,
      activeEventsDeck,
      currentPlayerMainCharacterDeck,
      currentPlayerCardsInHandDeck,
      currentPlayerEventsInPrepDeck,
      currentPlayerMinionsInPlayDeck,
      currentPlayerEventsInPrepGrid,
      currentPlayerBattlefieldGrid,
      enemyBattleFieldGrid,
      enemyMinionsInPlayDeck,
      currentPlayer
    );

    return performEventPhase;
  }

  execute() {
    let isPhaseFinished = false;

    switch (this._state) {
      case PerformEventState.INIT:
        console.log("INIT");
        this.#initializePhase();
        break;

      case PerformEventState.SELECT_PREPARED_EVENT:
        console.log("SELECT PREPARED EVENT");
        this.#selectPreparedEvent();
        break;

      case PerformEventState.EXECUTE_SELECTED_EVENT:
        console.log("EXECUTE SELECTED EVENT");
        this.#executeSelectedEvent();
        break;

      case PerformEventState.END:
        console.log("END");
        this.#updateDecksAndGrids();
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    this.resetXDeckCardsToYState(
      this.#currentPlayerEventsInPrepDeck,
      CardState.PLACED
    );

    this._state = PerformEventState.SELECT_PREPARED_EVENT;
  }

  #selectPreparedEvent() {
    const hoveredCard =
      this.#currentPlayerEventsInPrepDeck.lookForHoveredCard();

    if (
      hoveredCard &&
      hoveredCard.getCategory() !== CardCategory.WEAPON &&
      hoveredCard.getCategory() !== CardCategory.ARMOR &&
      hoveredCard.getCurrentPrepTimeInRounds() === 0
    ) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        this._state = PerformEventState.EXECUTE_SELECTED_EVENT;
      }
    }
  }

  #executeSelectedEvent() {
    const selectedCard =
      this.#currentPlayerEventsInPrepDeck.lookForSelectedCard();

    const selectedEventInstance =
      this.#determineAndCreateSelectedEvent(selectedCard);

    if (selectedCard.getInitialDurationInRounds() === 0) {
      selectedEventInstance.execute();
    } else {
      this.#events.push(selectedEventInstance);
    }

    this._state = PerformEventState.END;
  }

  #determineAndCreateSelectedEvent(selectedCard) {
    let selectedEventInstance;

    if (selectedCard.getCategory() === CardCategory.SPECIAL) {
      switch (selectedCard.getID()) {
        case SpecialEventID.SUMMON_CHARACTER:
          selectedEventInstance = new SummonCharacterEvent(
            this.#currentPlayer,
            selectedCard,
            this.#currentPlayerMainCharacterDeck,
            this.#currentPlayerCardsInHandDeck,
            this.#currentPlayerEventsInPrepDeck,
            this.#currentPlayerMinionsInPlayDeck,
            this.#currentPlayerEventsInPrepGrid,
            this.#currentPlayerBattlefieldGrid,
            this.#enemyBattleFieldGrid,
            this.#enemyMinionsInPlayDeck,
            this.#currentPlayer
          );
          selectedEventInstance.execute(this.#currentPlayer);
          break;
      }
    } else {
      switch (selectedCard.getID()) {
        case RareEventID.STOLEN_FATE:
          // HERE A "StolenFateEvent" INSTANCE IS CREATED
          break;
      }
    }

    return selectedEventInstance;
  }

  #updateDecksAndGrids() {
    const selectedCard =
      this.#currentPlayerEventsInPrepDeck.lookForSelectedCard();
    selectedCard.setState(CardState.PLACED);
    this.#currentPlayerEventsInPrepDeck.removeCard(selectedCard);

    const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
      this.#currentPlayerEventsInPrepGrid,
      selectedCard
    );
    boxEventCardWasPositionedIn.resetCard();

    if (selectedCard.getInitialDurationInRounds() === 0) {
      this.#eventsDeck.insertCard(selectedCard);
    } else {
      this.#activeEventsDeck.insertCard(selectedCard);
    }

    this._state = PerformEventState.INIT;
  }

  reset() {
    this._state = PerformEventState.INIT;
  }
}
