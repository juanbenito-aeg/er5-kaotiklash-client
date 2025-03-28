import Phase from "./Phase.js";
import {
  MovePhaseState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
  PhaseType
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class MovePhase extends Phase {
  #state;
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;
  #previousBox;

  constructor(state, decksRelevants, gridRelevants, mouseInput) {
    super(state, mouseInput);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#previousBox = null;
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
      gridRelevants = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    } else {
      gridRelevants = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    }

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      deckRelevants =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    } else {
      deckRelevants =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    }

    const movePhase = new MovePhase(
      MovePhaseState.INIT,
      deckRelevants,
      gridRelevants,
      mouseInput
    );

    return movePhase;
  }

  execute() {
    let isPhaseFinished = false;
    switch (this._state) {
      case MovePhaseState.INIT:
        this.#initializePhase();
        break;

      case MovePhaseState.SELECT_CARD:
        this.#selectCard();
        break;

      case MovePhaseState.SELECT_TARGET:
        this.#selectTargetGrid();
        break;

      case MovePhaseState.MOVE_CARD:
        this.#moveCardToBox();
        break;

      case MovePhaseState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;

      default:
        console.error("Move Event State Fail");
    }
    return isPhaseFinished;
  }

  #initializePhase() {
    globals.phaseType = PhaseType.MOVE;
    globals.currentPhase = PhaseType.MOVE;
    this._state = MovePhaseState.SELECT_CARD;
  }

  #selectCard() {
    console.log("select card phase");
    const battlefieldGrid = this.#gridsRelevants;
    for (let i = 0; i < battlefieldGrid.getBoxes().length; i++) {
      let box = battlefieldGrid.getBoxes()[i];
      if (
        this._mouseInput.isMouseOverBox(box) &&
        box.isOccupied() &&
        this._mouseInput.isLeftButtonPressed()
      ) {
        console.log("selected card");
        this.#selectedCard = box.getCard();
        this.#selectedCard.setState(CardState.SELECTED);
        console.log(this.#selectedCard.getName());
      }
    }
    if (this.#selectedCard) {
      this._state = MovePhaseState.SELECT_TARGET;
    }
  }

  #selectTargetGrid() {
    console.log("select target phase");

    const battlefieldGrid = this.#gridsRelevants;

    for (let i = 0; i < battlefieldGrid.getBoxes().length; i++) {
      if (
        this.#selectedCard.getXCoordinate() ===
          battlefieldGrid.getBoxes()[i].getXCoordinate() &&
        this.#selectedCard.getYCoordinate() ===
          battlefieldGrid.getBoxes()[i].getYCoordinate()
      ) {
        this.#previousBox = battlefieldGrid.getBoxes()[i];
      }
      const box = battlefieldGrid.getBoxes()[i];
      const targetBoxX = this.#selectedCard.getXCoordinate() - 135;
      const targetBoxY = this.#selectedCard.getYCoordinate() - 135;
      const targetBoxHeight = box.getHeight();
      const targetBoxWidth = box.getWidth();
      const targetSizeX = targetBoxX + targetBoxWidth * 3 + 50;
      const targetSizeY = targetBoxY + targetBoxHeight * 3 + 50;

      const isMouseOnAvailableArea =
        this._mouseInput.getMouseXCoordinate() >= targetBoxX &&
        this._mouseInput.getMouseXCoordinate() <= targetSizeX &&
        this._mouseInput.getMouseYCoordinate() >= targetBoxY &&
        this._mouseInput.getMouseYCoordinate() <= targetSizeY;

      if (
        this._mouseInput.isMouseOverBox(box) &&
        !box.isOccupied() &&
        this._mouseInput.isLeftButtonPressed() &&
        isMouseOnAvailableArea
      ) {
        this.#selectedGrid = box;
        box.setCard(this.#selectedCard);
        this.#previousBox.setState(BoxState.AVAILABLE);
        this.#previousBox.resetCard();
        box.setState(BoxState.SELECTED);
      }
    }
    if (this.#selectedGrid) {
      this._state = MovePhaseState.MOVE_CARD;
    }
  }

  #moveCardToBox() {
    if (this.#selectedCard) {
      this.#selectedCard.setXCoordinate(this.#selectedGrid.getXCoordinate());
      this.#selectedCard.setYCoordinate(this.#selectedGrid.getYCoordinate());
      this.#selectedCard.state = CardState.PLACED;
      this.#selectedGrid.state = BoxState.OCCUPIED;
      this._state = MovePhaseState.END;
    }
  }

  #finalizePhase() {
    console.log("finish phase");

    if (this.#selectedCard && this.#selectedGrid) {
      if (!this.#selectedGrid.isOccupied()) {
        this.#selectedGrid.setCard(this.#selectedCard);
        this.#selectedCard.setState(CardState.PLACED);
        this.#selectedCard = null;
        console.log(this.#selectedCard);
      }
      this.#selectedCard = null;
      this.#selectedGrid = null;
      this.#previousBox = null;
      this._state = MovePhaseState.INIT;
    }
  }
}
