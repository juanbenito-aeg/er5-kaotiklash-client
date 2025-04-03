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
import PhaseMessage from "../Messages/PhaseMessage.js";

export default class MovePhase extends Phase {
  #decksRelevants;
  #gridsRelevants;

  constructor(state, decksRelevants, gridRelevants, mouseInput) {
    super(state, mouseInput);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
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

    if (player.getID() === PlayerID.PLAYER_1) {
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

    let message = PhaseMessage.create(
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

    let message = PhaseMessage.create(
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
        let message = PhaseMessage.create(
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
    if (selectedCard.isLeftClicked()) {
      // THE PREVIOUSLY SELECTED CARD WAS DESELECTED
      selectedCard.setState(CardState.PLACED);
      this._state = MovePhaseState.SELECT_CARD;
    } else {
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

            selectedBox.resetCard();

            globals.currentState = MovePhaseState.MOVE_CARD;
            let message = PhaseMessage.create(
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
  }

  #moveCardToBox() {
    const selectedCard = this.#decksRelevants.lookForSelectedCard();
    const selectedTargetBox = this.#gridsRelevants.lookForSelectedBox();

    selectedTargetBox.setCard(selectedCard);

    selectedCard.setXCoordinate(selectedTargetBox.getXCoordinate());
    selectedCard.setYCoordinate(selectedTargetBox.getYCoordinate());

    selectedCard.setState(CardState.PLACED);
    selectedTargetBox.setState(BoxState.OCCUPIED);

    globals.currentState = MovePhaseState.END;
    let message = PhaseMessage.create(
      PhaseType.MOVE,
      MovePhaseState.END,
      Language.ENGLISH
    );
    globals.phasesMessages.push(message);

    this._state = MovePhaseState.END;
  }

  #finalizePhase() {
    console.log("finish phase");

    globals.phasesMessages.splice(0, globals.phasesMessages.length);

    this._state = MovePhaseState.INIT;
  }

  reset() {
    this._state = MovePhaseState.INIT;
  }
}
