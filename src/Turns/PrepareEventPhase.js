import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import PrepareEvent from "../Events/PrepareEvent.js";
import globals from "../Game/globals.js";
import {
  PrepareEventState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
} from "../Game/constants.js";

export default class PrepareEventPhase extends Phase {
  #player;
  #decksRelevants;
  #gridsRelevants;
  #events;
  #highlightedBoxes;

  constructor(
    state,
    mouseInput,
    phaseMessage,
    player,
    decksRelevants,
    gridRelevants,
    events,
    highlightedBoxes
  ) {
    super(state, mouseInput, phaseMessage);

    this.#player = player;
    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#events = events;
    this.#highlightedBoxes = highlightedBoxes;
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
    highlightedBoxes
  ) {
    let decksRelevants;
    let gridRelevants;

    if (player === currentPlayer) {
      gridRelevants = [
        board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT],
        board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND],
      ];
    } else {
      gridRelevants = [
        board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT],
        board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND],
      ];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      ];
    } else {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      ];
    }

    const prepareEventPhase = new PrepareEventPhase(
      PrepareEventState.INIT,
      mouseInput,
      phaseMessage,
      player,
      decksRelevants,
      gridRelevants,
      events,
      highlightedBoxes
    );

    return prepareEventPhase;
  }

  execute() {
    let isPhaseFinished = false;

    switch (this._state) {
      case PrepareEventState.INIT:
        this.#initializePhase();
        break;

      case PrepareEventState.SELECT_HAND_CARD:
        this.#selectCardFromHand();
        break;

      case PrepareEventState.SELECT_TARGET_GRID:
        this.#selectTargetGrid();
        break;

      case PrepareEventState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    this.resetXDeckCardsToYState(this.#decksRelevants[0], CardState.PLACED);
    this.resetXDeckCardsToYState(this.#decksRelevants[1], CardState.INACTIVE);

    this.resetXGridBoxesToYState(this.#gridsRelevants[0], BoxState.INACTIVE);

    this._state = PrepareEventState.SELECT_HAND_CARD;
  }

  #selectCardFromHand() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.prepareEvent.selectHandCard[globals.language]
    );

    const hoveredCard = this.#decksRelevants[0].lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        this._state = PrepareEventState.SELECT_TARGET_GRID;
      }
    }
  }

  #initTargetHighlights() {
    const allBoxes = this.#gridsRelevants[0].getBoxes();
    const available = [];
    for (let i = 0; i < allBoxes.length; i++) {
      const box = allBoxes[i];
      if (!box.getCard()) {
        available.push(box);
      }
    }
    this.#highlightedBoxes.boxes = available;
    this.#highlightedBoxes.color = "rgb(7, 255, 3)";
    this.#highlightedBoxes.isActive = true;
  }

  #selectTargetGrid() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.prepareEvent.selectTargetGrid[globals.language]
    );

    const selectedCard = this.#decksRelevants[0].lookForSelectedCard();

    if (selectedCard.isLeftClicked()) {
      // THE PREVIOUSLY SELECTED CARD WAS DESELECTED
      selectedCard.setState(CardState.PLACED);
      this._state = PrepareEventState.SELECT_HAND_CARD;
    } else {
      this.#initTargetHighlights();
      const hoveredBox = this.#gridsRelevants[0].lookForHoveredBox();

      if (hoveredBox) {
        if (!hoveredBox.isLeftClicked()) {
          hoveredBox.setState(BoxState.HOVERED);
        } else {
          if (!hoveredBox.getCard()) {
            hoveredBox.setState(BoxState.SELECTED);
            this._state = PrepareEventState.END;
          }
        }
      }
    }
  }

  #finalizePhase() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.prepareEvent.moveCard[globals.language]
    );

    const selectedCard = this.#decksRelevants[0].lookForSelectedCard();

    this.#decksRelevants[1].insertCard(selectedCard);
    this.#decksRelevants[0].removeCard(selectedCard);

    const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
      this.#gridsRelevants[1],
      selectedCard
    );
    boxEventCardWasPositionedIn.resetCard();

    const selectedBox = this.#gridsRelevants[0].lookForSelectedBox();
    selectedBox.setCard(selectedCard);

    selectedCard.setXCoordinate(selectedBox.getXCoordinate());
    selectedCard.setYCoordinate(selectedBox.getYCoordinate());

    selectedCard.setState(CardState.PLACED);
    selectedBox.setState(BoxState.OCCUPIED);

    const prepareEvent = PrepareEvent.create(this.#player, selectedCard);
    this.#events.push(prepareEvent);

    this.#resetHighlightedBoxes();

    this._state = PrepareEventState.INIT;
  }

  #resetHighlightedBoxes() {
    this.#highlightedBoxes.boxes = null;
    this.#highlightedBoxes.color = null;
    this.#highlightedBoxes.isActive = false;
  }
  reset() {
    this.#resetHighlightedBoxes();
    this.#initializePhase();
    this._state = PrepareEventState.INIT;
  }
}
