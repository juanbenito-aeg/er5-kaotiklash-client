import Phase from "./Phase.js";
import SummonCharacterEvent from "../Events/SummonCharacterEvent.js";
import JudgmentAncientsEvent from "../Events/JudgmentAncientsEvent.js";
import BroomFuryEvent from "../Events/BroomFuryEvent.js";
import BlessingWaitressEvent from "../Events/BlessingWaitressEvent.js";
import {
  CardCategory,
  CardState,
  DeckType,
  PerformEventState,
  PlayerID,
  GridType,
  SpecialEventID,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class PerformEventPhase extends Phase {
  #events;
  #eventsDeck;
  #activeEventsDeck;
  #currentPlayerMainCharacterDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyMinionsInPlayDeck;
  #enemyBattlefieldGrid;
  #lucretiaDeers;
  #player;

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
    currentPlayerMinionsDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyMinionsInPlayDeck,
    enemyBattlefieldGrid,
    lucretiaDeers,
    player
  ) {
    super(state, mouseInput, phaseMessage);

    this.#events = events;
    this.#eventsDeck = eventsDeck;
    this.#activeEventsDeck = activeEventsDeck;
    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsDeck = currentPlayerMinionsDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#lucretiaDeers = lucretiaDeers;
    this.#player = player;
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
    const lucretiaDeers = deckContainer.getDecks()[DeckType.LUCRETIA_DEERS];
    let currentPlayerMainCharacterDeck;
    let currentPlayerCardsInHandDeck;
    let currentPlayerEventsInPrepDeck;
    let currentPlayerMinionsDeck;
    let currentPlayerMinionsInPlayDeck;
    let enemyMinionsInPlayDeck;

    if (player.getID() === PlayerID.PLAYER_1) {
      currentPlayerMainCharacterDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MAIN_CHARACTER];

      currentPlayerCardsInHandDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];

      currentPlayerEventsInPrepDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION];

      currentPlayerMinionsDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];

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

      currentPlayerMinionsDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];

      currentPlayerMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

      enemyMinionsInPlayDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    }

    let currentPlayerEventsInPrepGrid;
    let currentPlayerBattlefieldGrid;
    let enemyBattlefieldGrid;

    if (player === currentPlayer) {
      currentPlayerEventsInPrepGrid =
        board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];

      currentPlayerBattlefieldGrid =
        board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];

      enemyBattlefieldGrid = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    } else {
      currentPlayerEventsInPrepGrid =
        board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];

      currentPlayerBattlefieldGrid =
        board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];

      enemyBattlefieldGrid = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
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
      currentPlayerMinionsDeck,
      currentPlayerMinionsInPlayDeck,
      currentPlayerEventsInPrepGrid,
      currentPlayerBattlefieldGrid,
      enemyMinionsInPlayDeck,
      enemyBattlefieldGrid,
      lucretiaDeers,
      player
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
      // MAKE IT IMPOSSIBLE FOR THE PLAYER TO USE THE "Summon Character" EVENT IF ONE IS ALREADY ACTIVE
      if (
        hoveredCard.getCategory() === CardCategory.SPECIAL &&
        hoveredCard.getID() === SpecialEventID.SUMMON_CHARACTER &&
        globals.isPlayersSummonCharacterActive[this.#player.getID()]
      ) {
        return;
      }

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

    let selectedEventInstance;
    if (!globals.blessingWaitressCardData.isEventActive) {
      selectedEventInstance =
        this.#determineAndCreateSelectedEvent(selectedCard);
    } else {
      selectedEventInstance = globals.blessingWaitressCardData.eventInstance;
    }

    if (selectedCard.getInitialDurationInRounds() === 0) {
      selectedEventInstance.execute();
    } else {
      this.#events.push(selectedEventInstance);
    }

    if (!globals.blessingWaitressCardData.isEventActive) {
      this._state = PerformEventState.END;
    }
  }

  #determineAndCreateSelectedEvent(selectedCard) {
    let selectedEventInstance;

    if (selectedCard.getCategory() === CardCategory.SPECIAL) {
      switch (selectedCard.getID()) {
        case SpecialEventID.SUMMON_CHARACTER:
          selectedEventInstance = new SummonCharacterEvent(
            this.#player,
            selectedCard,
            this.#currentPlayerMainCharacterDeck,
            this.#currentPlayerCardsInHandDeck,
            this.#currentPlayerEventsInPrepDeck,
            this.#currentPlayerMinionsInPlayDeck,
            this.#currentPlayerEventsInPrepGrid,
            this.#currentPlayerBattlefieldGrid,
            this.#enemyMinionsInPlayDeck,
            this.#enemyBattlefieldGrid,
            this.#lucretiaDeers
          );

          globals.isPlayersSummonCharacterActive[this.#player.getID()] = true;

          // selectedEventInstance.execute(this.#currentPlayer);

          break;

        case SpecialEventID.JUDGMENT_ANCIENTS:
          selectedEventInstance = new JudgmentAncientsEvent(
            this.#player,
            selectedCard
          );
          break;

        case SpecialEventID.BROOM_FURY:
          selectedEventInstance = new BroomFuryEvent(
            this.#player,
            selectedCard,
            this.#currentPlayerMinionsDeck,
            this.#currentPlayerMinionsInPlayDeck
          );
          break;

        case SpecialEventID.BLESSING_WAITRESS:
          globals.blessingWaitressCardData.isEventActive = true;

          selectedEventInstance =
            globals.blessingWaitressCardData.eventInstance =
              new BlessingWaitressEvent(
                this.#player,
                selectedCard,
                this.#currentPlayerMinionsInPlayDeck
              );

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
