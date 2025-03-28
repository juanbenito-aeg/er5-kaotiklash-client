import Phase from "./Phase.js";
import { globals } from "../index.js";
import PhasesMessages from "../Messages/PhasesMessages.js";
import { PhaseType } from "../Game/constants.js";
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
  // #currentPlayer;
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

    let message = new PhasesMessages(PhaseType.INVALID,null,300)
    globals.phasesMessages.push(message);

    return prepareEventPhase;
  }

  execute() {
    this.#isPhaseFinished = false;

    switch (this._state) {
      case PrepareEventState.INIT:
        console.log("init");
        this.#initializePhase();
        break;

      case PrepareEventState.SELECT_HAND_CARD:
        console.log("select hand card");
        this.#selectCardFromHand();
        break;

      case PrepareEventState.SELECT_TARGET_GRID:
        console.log("select target grid");
        this.#selectTargetGrid();
        break;

      case PrepareEventState.END:
        console.log("end");
        this.#finalizePhase();
        break;

      default:
        console.error("Prepare Event State Fail");
    }

    return this.#isPhaseFinished;
  }

  #initializePhase() {
    // let prepareEventMessage = new PhasesMessages(PhaseType.PREPARE_EVENT, null, 300)
    globals.currentPhase = PhaseType.PREPARE_EVENT;
    // globals.phasesMessages.push(prepareEventMessage)
    this._state = PrepareEventState.SELECT_HAND_CARD;
  }

  #selectCardFromHand() {
    for (let i = 0; i < this.#decksRelevants.length; i++) {
      let deck = this.#decksRelevants[i];

      const hoveredCard = deck.lookForHoveredCard(this._mouseInput);

      for (let j = 0; j < deck.getCards().length; j++) {
        let card = deck.getCards()[j];

        if (card === hoveredCard && this._mouseInput.isLeftButtonPressed()) {
          card.setState(CardState.SELECTED);

          this.#selectedCard = card;

          this._state = PrepareEventState.SELECT_TARGET_GRID;
        }
      }
    }
  }

  #selectTargetGrid() {
    let grids = this.#gridsRelevants;

    let boxes = grids.getBoxes();

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];

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
    globals.phasesMessages.splice(0,1)
  }
}
