import Phase from "./Phase.js";
import {
  PrepareEventState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
  Language,
  PhaseType,
} from "../Game/constants.js";
import PrepareEvent from "../Events/PrepareEvent.js";
import PhasesMessages from "../Messages/PhasesMessages.js";

export default class PrepareEventPhase extends Phase {
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;
  #events;
  #currentPlayer;
  #isPhaseFinished;
  #phaseMessage;

  constructor(
    currentPlayer,
    decksRelevants,
    gridRelevants,
    mouseInput,
    events,
    phaseMessage,
    state
  ) {
    super(state, mouseInput);
    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#events = events;
    this.#currentPlayer = currentPlayer;
    this._state = PrepareEventState.INIT;
    this.#isPhaseFinished = false;
    this.#phaseMessage = phaseMessage;
  }

  static create(
    currentPlayer,
    deckContainer,
    board,
    mouseInput,
    events,
    phaseMessage
  ) {
    let deckRelevants;
    let gridRelevants;

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      ];
      gridRelevants = board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];
    } else {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      ];
      gridRelevants = board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];
    }
    console.log(currentPlayer);
    const prepareEventPhase = new PrepareEventPhase(
      currentPlayer,
      deckRelevants,
      gridRelevants,
      mouseInput,
      events,
      phaseMessage
    );

    return prepareEventPhase;
  }

  execute() {
    console.log("aaa");
    this.#isPhaseFinished = false;

    const phaseMessage = PhasesMessages.create(
      PhaseType.PREPARE_EVENT,
      Language.ENGLISH
    );
    this.#phaseMessage.push(phaseMessage);
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
      console.log("mama");
      for (let j = 0; j < decks.getCards().length; j++) {
        let cards = decks.getCards()[j];
        if (
          this._mouseInput.isLeftButtonPressed() &&
          cards.getState() === CardState.INACTIVE_HOVERED
        ) {
          cards.setState(CardState.SELECTED);
          this.#selectedCard = cards;
          console.log(this.#selectedCard);
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
    console.log(this.#gridsRelevants);

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
        console.log(console.log(box.getState()));
        console.log(this.#selectedGrid);
        this._state = PrepareEventState.END;
      }
    }
  }

  #finalizePhase() {
    console.log("bauino");

    if (!this.#selectedCard || !this.#selectedGrid) {
      return;
    }
    console.log(this.#currentPlayer);
    if (
      this.#selectedCard.getState() === CardState.SELECTED &&
      this.#selectedGrid.getState() === BoxState.SELECTED
    ) {
      this.#selectedCard.setXCoordinate(this.#selectedGrid.getXCoordinate());
      this.#selectedCard.setYCoordinate(this.#selectedGrid.getYCoordinate());
      console.log(this.#selectedCard.getState());
      console.log("----------");
      console.log(this.#currentPlayer.getID());
      this.#selectedGrid.setCard(this.#selectedCard);
      this.#decksRelevants[0].removeCard(this.#selectedCard);
      this.#decksRelevants[1].insertCard(this.#selectedCard);
      this.#selectedCard.setState(CardState.PLACED);
      this.#selectedGrid.setState(BoxState.OCCUPIED);
      console.log(this.#decksRelevants[0]);
      console.log(this.#decksRelevants[1]);

      const prepareEvent = PrepareEvent.create(
        this.#decksRelevants[1],
        this.#currentPlayer
      );
      console.log(this.#events);
      this.#events.push(prepareEvent);
      console.log("-----");
      console.log(this.#events[0]);
      this.#selectedCard = null;
      this.#selectedGrid = null;
      this._state = PrepareEventState.INIT;
      this.#isPhaseFinished = true;
    }
  }
}
