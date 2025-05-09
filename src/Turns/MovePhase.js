import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import globals from "../Game/globals.js";
import {
  MovePhaseState,
  CardState,
  BoxState,
  PlayerID,
  DeckType,
  GridType,
} from "../Game/constants.js";
import Physics from "../Game/Physics.js";

export default class MovePhase extends Phase {
  #decksRelevants;
  #gridsRelevants;
  #physics;
  #movingCard;

  constructor(state, mouseInput, phaseMessage, decksRelevants, gridRelevants) {
    super(state, mouseInput, phaseMessage);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#physics = null;
    this.#movingCard = null;
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
    let decksRelevants;
    let gridRelevants;

    if (player === currentPlayer) {
      gridRelevants = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    } else {
      gridRelevants = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      decksRelevants =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    } else {
      decksRelevants =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    }

    const movePhase = new MovePhase(
      MovePhaseState.INIT,
      mouseInput,
      phaseMessage,
      decksRelevants,
      gridRelevants
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

      case MovePhaseState.ANIMATION_CARD:
        this.#animateCardMovement();
        break;

      case MovePhaseState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    this.#resetRelevantCardsStates([this.#decksRelevants]);

    this._state = MovePhaseState.SELECT_CARD;
  }

  #selectCard() {
    console.log("select card phase");

    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.move.selectCard[globals.language]
    );

    const hoveredCard = this.#decksRelevants.lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);

        this._state = MovePhaseState.SELECT_TARGET;
      }
    }
  }

  #selectTargetGrid() {
    console.log("select target phase");

    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.move.selectTarget[globals.language]
    );

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

            this._state = MovePhaseState.MOVE_CARD;
          }
        }
      }
    }
  }

  #moveCardToBox() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.move.moveCard[globals.language]
    );

    const selectedCard = this.#decksRelevants.lookForSelectedCard();
    const selectedTargetBox = this.#gridsRelevants.lookForSelectedBox();

    this.#movingCard = selectedCard;
    selectedCard.setState(CardState.MOVING);

    const startX = selectedCard.getXCoordinate();
    const startY = selectedCard.getYCoordinate();
    const endX = selectedTargetBox.getXCoordinate();
    const endY = selectedTargetBox.getYCoordinate();

    this.#physics = new Physics(20, 5, 0, 0, 0, 0, 0);

    this.#physics.ax = (endX - startX) * 0.01;
    this.#physics.ay = (endY - startY) * 0.01;

    this._state = MovePhaseState.ANIMATION_CARD;
  }

  #animateCardMovement() {
    const selectedCard = this.#movingCard;
    const selectedTargetBox = this.#gridsRelevants.lookForSelectedBox();
    if (!selectedCard || !selectedTargetBox) return;

    const targetX = selectedTargetBox.getXCoordinate();
    const targetY = selectedTargetBox.getYCoordinate();

    const currentX = selectedCard.getXCoordinate();
    const currentY = selectedCard.getYCoordinate();

    const dx = targetX - currentX;
    const dy = targetY - currentY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 0.5) {
      selectedCard.setXCoordinate(targetX);
      selectedCard.setYCoordinate(targetY);
      selectedTargetBox.setCard(selectedCard);
      selectedCard.setState(CardState.PLACED);
      selectedTargetBox.setState(BoxState.OCCUPIED);
      this.#movingCard = null;
      this.#physics = null;
      this._state = MovePhaseState.END;
      return;
    }
    const speed = 10;
    let ratio = speed / distance;

    ratio = Math.min(ratio, 1);

    selectedCard.setXCoordinate(currentX + dx * ratio);
    selectedCard.setYCoordinate(currentY + dy * ratio);
  }

  #finalizePhase() {
    console.log("finish phase");

    this._state = MovePhaseState.INIT;
  }

  reset() {
    this._state = MovePhaseState.INIT;
  }

  #resetRelevantCardsStates(decks) {
    for (let i = 0; i < decks.length; i++) {
      const currentDeck = decks[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];
        currentCard.setState(CardState.PLACED);
      }
    }
  }
}
