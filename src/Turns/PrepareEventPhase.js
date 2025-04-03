import Phase from "./Phase.js";
import { globals } from "../index.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import { Language, PhaseType } from "../Game/constants.js";
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
  #events;

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
    this.#events = events;
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

    let message = PhaseMessage.create(
      PhaseType.PREPARE_EVENT,
      PrepareEventState.INIT,
      Language.ENGLISH
    );
    globals.phasesMessages.push(message);

    return prepareEventPhase;
  }

  execute() {
    let isPhaseFinished = false;

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
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    globals.currentPhase = PhaseType.PREPARE_EVENT;
    globals.currentState = PrepareEventState.SELECT_HAND_CARD;
    let message = PhaseMessage.create(
      PhaseType.PREPARE_EVENT,
      PrepareEventState.INIT,
      Language.ENGLISH
    );
    globals.phasesMessages.push(message);

    this._state = PrepareEventState.SELECT_HAND_CARD;
  }

  #selectCardFromHand() {
    const hoveredCard = this.#decksRelevants[0].lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        globals.currentState = PrepareEventState.SELECT_TARGET_GRID;
        let message = PhaseMessage.create(
          PhaseType.PREPARE_EVENT,
          PrepareEventState.SELECT_HAND_CARD,
          Language.ENGLISH
        );
        globals.phasesMessages.push(message);

        this._state = PrepareEventState.SELECT_TARGET_GRID;
      }
    }
  }

  #selectTargetGrid() {
    const selectedCard = this.#decksRelevants[0].lookForSelectedCard();

    if (selectedCard.isLeftClicked()) {
      // THE PREVIOUSLY SELECTED CARD WAS DESELECTED
      selectedCard.setState(CardState.PLACED);
      this._state = PrepareEventState.SELECT_HAND_CARD;
    } else {
      const hoveredBox = this.#gridsRelevants[0].lookForHoveredBox();

      if (hoveredBox) {
        if (!hoveredBox.isLeftClicked()) {
          hoveredBox.setState(BoxState.HOVERED);
        } else {
          hoveredBox.setState(BoxState.SELECTED);

          globals.currentState = PrepareEventState.END;
          let message = PhaseMessage.create(
            PhaseType.PREPARE_EVENT,
            PrepareEventState.END,
            Language.ENGLISH
          );
          globals.phasesMessages.push(message);

          this._state = PrepareEventState.END;
        }
      }
    }
  }

  #finalizePhase() {
    const selectedCard = this.#decksRelevants[0].lookForSelectedCard();

    this.#decksRelevants[1].insertCard(selectedCard);
    this.#decksRelevants[0].removeCard(selectedCard);

    const handGrid = this.#gridsRelevants[1];
    const boxes = handGrid.getBoxes();
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].getCard() === selectedCard) {
        boxes[i].resetCard();
        break;
      }
    }

    const selectedBox = this.#gridsRelevants[0].lookForSelectedBox();
    selectedBox.setCard(selectedCard);

    selectedCard.setXCoordinate(selectedBox.getXCoordinate());
    selectedCard.setYCoordinate(selectedBox.getYCoordinate());

    selectedCard.setState(CardState.PLACED);
    selectedBox.setState(BoxState.OCCUPIED);

    const prepareEvent = PrepareEvent.create(
      this.#decksRelevants[1],
      this.#player
    );

    this.#events.push(prepareEvent);

    this._state = PrepareEventState.INIT;

    globals.phasesMessages.splice(0, globals.phasesMessages.length);
  }

  reset() {
    this._state = PrepareEventState.INIT;
  }
}
