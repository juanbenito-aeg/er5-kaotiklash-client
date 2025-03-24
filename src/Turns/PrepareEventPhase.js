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
  #state;
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;

  constructor(state, decksRelevants, gridRelevants, mouseInput) {
    super(state, mouseInput);
    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
  }

  static create(currentPlayer, deckContainer, board, mouseInput) {
    let deckRelevants;
    let gridRelevants;

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      ];
      gridRelevants = [
        board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND],
        board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT],
      ];
    } else {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      ];
      gridRelevants = [
        board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND],
        board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT],
      ];
    }

    const prepareEventPhase = new PrepareEventPhase(
      PrepareEventState.INIT,
      deckRelevants,
      gridRelevants,
      mouseInput
    );

    return prepareEventPhase;
  }

  execute() {
    let isPhaseFinished = false;
    console.log("aaa");
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

      default:
        console.error("Prepare Event State Fail");
    }
    return isPhaseFinished;
  }

  #initializePhase() {
    this.state = PrepareEventState.SELECT_HAND_CARD;
  }

  #selectCardFromHand() {
    const handGrid = this.gridRelevants[0];
    for (let i = 0; i < handGrid.getBoxes().length; i++) {
      const box = handGrid.getBoxes()[i];
      if (this.mouseInput.isMouseOverBox(box) && !box.isOccupied()) {
        this.#selectedCard = box.getCard();
        this.#selectedCard.setState(CardState.SELECTED);
        console.log(this.#selectedCard.getName());
      }
    }
    if (this.#selectedCard) {
      this.state = PrepareEventState.SELECT_TARGET_GRID;
    }
  }

  #selectTargetGrid() {
    const preparationGrid = this.gridRelevants[1];
    for (let i = 0; i < preparationGrid.getBoxes().length; i++) {
      const box = preparationGrid.getBoxes()[i];
      if (this.mouseInput.isMouseOverBox(box) && !box.isOccupied()) {
        this.#selectedGrid = box;
        box.setState(BoxState.SELECTED);
      }
    }
    if (this.#selectedGrid) {
      this.state = PrepareEventState.END;
    }
  }

  #finalizePhase() {
    if (this.#selectedCard && this.#selectedGrid) {
      if (!this.#selectedGrid.isOccupied()) {
        this.#selectedGrid.setCard(this.#selectedCard);
        this.#selectedCard.setState(CardState.PLACED);
        this.decksRelevants[1].insertCard(this.#selectedCard);
        this.#selectedCard = null;
      }
      this.#selectedGrid = null;
      const prepareEvent = PrepareEvent.create(this.decksRelevants[1]);
      game.addEventToQueue(prepareEvent);
    }
  }
}
