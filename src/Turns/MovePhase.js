import Phase from "./Phase.js";
import {
  MovePhaseState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
  PhaseType,
  Language,
} from "../Game/constants.js";
import { globals } from "../index.js";
import PhasesMessages from "../Messages/PhasesMessages.js";

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

    let message = PhasesMessages.create(
      PhaseType.MOVE,
      MovePhaseState.INIT,
      Language.ENGLISH
    );
    globals.phasesMessages.push(message);

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
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    globals.currentPhase = PhaseType.MOVE;
    globals.currentState = MovePhaseState.SELECT_CARD;

    let message = PhasesMessages.create(
      PhaseType.MOVE,
      MovePhaseState.SELECT_CARD,
      Language.ENGLISH
    );
    globals.phasesMessages.push(message);

    this._state = MovePhaseState.SELECT_CARD;
  }

  #selectCard() {
    console.log("select card phase");

    const hoveredCard = this.#decksRelevants.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        globals.currentState = MovePhaseState.SELECT_TARGET;
        let message = PhasesMessages.create(
          PhaseType.MOVE,
          MovePhaseState.SELECT_TARGET,
          Language.ENGLISH
        );
        globals.phasesMessages.push(message);

        this._state = MovePhaseState.SELECT_TARGET;
      }
    }
  }

  #selectTargetGrid() {
    console.log("select target phase");

    const selectedCard = this.#decksRelevants.lookForSelectedCard();

    let selectedBox;
    for (let i = 0; i < this.#gridsRelevants.getBoxes().length; i++) {
      if (
        selectedCard.getXCoordinate() ===
          this.#gridsRelevants.getBoxes()[i].getXCoordinate() &&
        selectedCard.getYCoordinate() ===
          this.#gridsRelevants.getBoxes()[i].getYCoordinate()
      ) {
        selectedBox = this.#gridsRelevants.getBoxes()[i];
      }
    }

    const targetBoxX = selectedCard.getXCoordinate() - 135;
    const targetBoxY = selectedCard.getYCoordinate() - 135;
    const targetBoxHeight = selectedBox.getHeight();
    const targetBoxWidth = selectedBox.getWidth();
    const targetSizeX = targetBoxX + targetBoxWidth * 3 + 50;
    const targetSizeY = targetBoxY + targetBoxHeight * 3 + 50;

    const isMouseOnAvailableArea =
      this._mouseInput.getMouseXCoordinate() >= targetBoxX &&
      this._mouseInput.getMouseXCoordinate() <= targetSizeX &&
      this._mouseInput.getMouseYCoordinate() >= targetBoxY &&
      this._mouseInput.getMouseYCoordinate() <= targetSizeY;

    if (isMouseOnAvailableArea) {
      const hoveredTargetBox = this.#gridsRelevants.lookForHoveredBox();
      if (hoveredTargetBox && !hoveredTargetBox.isOccupied()) {
        if (!hoveredTargetBox.isLeftClicked()) {
          hoveredTargetBox.setState(BoxState.HOVERED);
        } else {
          hoveredTargetBox.setState(BoxState.SELECTED);
          hoveredTargetBox.setCard(selectedCard);

          selectedBox.resetCard();

          globals.currentState = MovePhaseState.MOVE_CARD;
          let message = PhasesMessages.create(
            PhaseType.MOVE,
            MovePhaseState.MOVE_CARD,
            Language.ENGLISH
          );
          globals.phasesMessages.push(message);

          this._state = MovePhaseState.MOVE_CARD;
        }
      }
    }
  }

  #moveCardToBox() {
    if (this.#selectedCard) {
      this.#selectedCard.setXCoordinate(this.#selectedGrid.getXCoordinate());
      this.#selectedCard.setYCoordinate(this.#selectedGrid.getYCoordinate());
      this.#selectedCard.state = CardState.PLACED;
      this.#selectedGrid.state = BoxState.OCCUPIED;
      globals.currentState = MovePhaseState.END;
      let message = PhasesMessages.create(
        PhaseType.MOVE,
        MovePhaseState.END,
        Language.ENGLISH
      );
      globals.phasesMessages.push(message);
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
      }
      this.#selectedCard = null;
      this.#selectedGrid = null;
      this.#previousBox = null;
      this._state = MovePhaseState.INIT;
      globals.phasesMessages.splice(0, globals.phasesMessages.length);
    }
  }

  reset() {
    this._state = MovePhaseState.INIT;

    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#previousBox = null;
  }
}
