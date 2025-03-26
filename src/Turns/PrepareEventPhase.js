import Phase from "./Phase.js";
import {
  PrepareEventState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
} from "../Game/constants.js";
import PrepareEvent from "../Events/PrepareEvent.js";

export default class PrepareEventPhase extends Phase {
  #player;
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;
  #events;
  #isPhaseFinished;

  constructor(
    state,
    mouseInput,
    player,
    decksRelevants,
    gridRelevants,
    events
  ) {
    super(state, mouseInput);

    this.#player = player;
    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#events = events;
    this.#isPhaseFinished = false;
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer
  ) {
    let deckRelevants;
    let gridRelevants;

    if (player === currentPlayer) {
      gridRelevants = board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];
    } else {
      gridRelevants = board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      ];
    } else {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      ];
    }

    const prepareEventPhase = new PrepareEventPhase(
      PrepareEventState.INIT,
      mouseInput,
      player,
      deckRelevants,
      gridRelevants,
      events
    );

    return prepareEventPhase;
  }

  execute() {
    this.#isPhaseFinished = false;

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
        break;

      default:
        console.error("Prepare Event State Fail");
    }

    return this.#isPhaseFinished;
  }

  #initializePhase() {
    this._state = PrepareEventState.SELECT_HAND_CARD;
  }

  #selectCardFromHand() {
    this.#lookForHoveredCard(this.#decksRelevants);

    for (let i = 0; i < this.#decksRelevants.length; i++) {
      let decks = this.#decksRelevants[i];
      for (let j = 0; j < decks.getCards().length; j++) {
        let cards = decks.getCards()[j];
        if (
          this._mouseInput.isLeftButtonPressed() &&
          cards.getState() === CardState.INACTIVE_HOVERED
        ) {
          cards.setState(CardState.SELECTED);
          this.#selectedCard = cards;
          if (this.#selectedCard.getState() === CardState.SELECTED) {
            this._state = PrepareEventState.SELECT_TARGET_GRID;
          }
        }
      }
    }
  }

  #lookForHoveredCard(decksToCheck) {
    for (let i = 0; i < this.#decksRelevants.length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#decksRelevants[i];

          const hoveredCard = currentDeck.lookForHoveredCard(this._mouseInput);

          if (hoveredCard) {
            if (hoveredCard.getState() === CardState.INACTIVE) {
              hoveredCard.setPreviousState(CardState.INACTIVE);
              hoveredCard.setState(CardState.INACTIVE_HOVERED);
            } else if (hoveredCard.getState() === CardState.PLACED) {
              hoveredCard.setPreviousState(CardState.PLACED);
              hoveredCard.setState(CardState.HOVERED);
            }

            return hoveredCard;
          }
        }
      }
    }
  }

  #selectTargetGrid() {
    let grids = this.#gridsRelevants;
    let boxes = grids.getBoxes();
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      this._mouseInput.isMouseOverBox(box);
      if (this._mouseInput.isMouseOverBox(box)) {
        box.setState(BoxState.HOVERED);
      }
      if (
        this._mouseInput.isLeftButtonPressed() &&
        this._mouseInput.isMouseOverBox(box)
      ) {
        box.setState(BoxState.SELECTED);
        this.#selectedGrid = box;
        this._state = PrepareEventState.END;
      }
    }
  }

  #finalizePhase() {
    if (!this.#selectedCard || !this.#selectedGrid) {
      return;
    }

    if (
      this.#selectedCard.getState() === CardState.SELECTED &&
      this.#selectedGrid.getState() === BoxState.SELECTED
    ) {
      this.#selectedGrid.setCard(this.#selectedCard);

      this.#decksRelevants[0].removeCard(this.#selectedCard);
      this.#decksRelevants[1].insertCard(this.#selectedCard);

      this.#selectedCard.setXCoordinate(this.#selectedGrid.getXCoordinate());
      this.#selectedCard.setYCoordinate(this.#selectedGrid.getYCoordinate());

      this.#selectedCard.setState(CardState.PLACED);
      this.#selectedGrid.setState(BoxState.OCCUPIED);

      const prepareEvent = PrepareEvent.create(
        this.#decksRelevants[1],
        this.#player
      );

      this.#events.push(prepareEvent);
      this.#selectedCard = null;
      this.#selectedGrid = null;
      this._state = PrepareEventState.INIT;
      this.#isPhaseFinished = true;
    }
  }
}
