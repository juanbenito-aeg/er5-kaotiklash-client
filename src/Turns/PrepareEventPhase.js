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
      gridRelevants = board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];
    } else {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      ];
      gridRelevants = board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];
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
        box.getState() === BoxState.HOVERED
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
    /*    this.#selectedCard();
    this.#selectTargetGrid(); */

    console.log("bauino");

    if (
      this.#selectedCard.getState() === CardState.SELECTED &&
      this.#selectedGrid.getState() === BoxState.SELECTED
    ) {
      this.#selectedGrid.setCard(this.#selectedCard);
      this.#selectedCard.setState(CardState.PLACED);
      console.log(this.#selectedCard.getState());
      this.#decksRelevants[0].removeCard(this.#selectedCard);
      this.#decksRelevants[1].insertCard(this.#selectedCard);
      console.log(this.#decksRelevants[0]);
      console.log(this.#decksRelevants[1]);
      /*       this.#selectedCard = null;
      this.#selectedGrid = null;
      const prepareEvent = PrepareEvent.create(this.decksRelevants[1]);
      game.addEventToQueue(prepareEvent); */
    }
  }
}
