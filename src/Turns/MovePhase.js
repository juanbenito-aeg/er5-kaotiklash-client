import Phase from "./Phase.js";
import { MovePhaseState, CardState, BoxState } from "../Game/constants.js";

export default class MovePhase extends Phase {
  #state;
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;

  constructor(
    state,
    decksRelevants,
    gridRelevants,
    mouseInput
  ) {
    super(state, mouseInput);
    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#state = state;

  }

  static create(currentPlayer, deckContainer, board, mouseInput) {
    let deckRelevants;
    let gridRelevants;

    if(currentPlayer.getID() === PlayerID.PLAYER_1) {
      deckRelevants = deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      gridRelevants = board.getGrids()[GridType.PLAYER_1_MINIONS_IN_PLAY]
    } else {
      deckRelevants = deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      gridRelevants = board.getGrids()[GridType.PLAYER_2_MINIONS_IN_PLAY]
    }

    const movePhase = new movePhase(
      MovePhaseState.INIT,
      deckRelevants,
      gridRelevants,
      mouseInput
    );

    return movePhase;
  }

  execute() {
    console.log("halo")
    switch (this.state) {
      case PrepareEventState.INIT:
        this.#initializePhase();
        break;

      case PrepareEventState.SELECT_CARD:
        this.#selectCard();
        break;

      case PrepareEventState.SELECT_TARGET:
        this.#selectTargetGrid();
        break;

      case PrepareEventState.MOVE_CARD:
        this.#moveCardToBox();
        break;
      
      case PrepareEventState.END:
        this.#finalizePhase();
        break;
      
      default:
        console.error("Move Event State Fail");
    }
  }

  #initializePhase() {
    this.state = MovePhaseState.SELECT_CARD;
  }

  #selectCard() {
    const battlefieldGrid = this.gridRelevants;
    for (let i = 0; i < battlefieldGrid.getBoxes().length; i++) {
      const box = battlefieldGrid.getBoxes()[i];
      if (this.mouseInput.isMouseOverBox(box) && !box.isOccupied()) {
        this.#selectedCard = box.getCard();
        this.#selectedCard.setState(CardState.SELECTED);
        console.log(this.#selectedCard.getName())
      }
    }
    if (this.#selectedCard) {
      this.state = MovePhaseState.SELECT_TARGET;
    }
  }

  #selectTargetGrid() {
    const battlefieldGrid = this.gridRelevants;
    for (let i = 0; i < battlefieldGrid.getBoxes().length; i++) {
      const box = battlefieldGrid.getBoxes()[i];
      if (this.mouseInput.isMouseOverBox(box) && !box.isOccupied()) {
        this.#selectedGrid = box;
        box.setState(BoxState.SELECTED);
      }
    }
    if (this.#selectedGrid) {
      this.state = MovePhaseState.MOVE_CARD;
    }
  }

  #moveCardToBox() {
    if (this.#selectedCard) {
      this.#selectedCard.setXCoordinate() = this.#selectedGrid.getXCoordinate();
      this.#selectedCard.setYCoordinate() = this.#selectedGrid.getYCoordinate();
      this.#selectedCard.state = CardState.PLACED;
      targetBox.state = BoxState.OCCUPIED;
    }
  }

  #finalizePhase() {
    if (this.#selectedCard && this.#selectedGrid) {
      if (!this.#selectedGrid.isOccupied()) {
        this.#selectedGrid.setCard(this.#selectedCard); 
        this.#selectedCard.setState(CardState.PLACED);
        this.#selectedCard = null;
      }
      this.#selectedGrid = null;
      this.state = PrepareEventState.END;
    }
  }

}
