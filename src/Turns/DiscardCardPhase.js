import Phase from "./Phase.js";
import { DiscardCardState, CardState, BoxState, GridType, PlayerID, PhaseType, DeckType} from "../Game/constants.js";
import { globals } from "../index.js";

export default class DiscardCardPhase extends Phase {
  #state;
  #decksRelevants;
  #gridsRelevants;
  #selectedCard;
  #selectedGrid;
  #skipButtonPressed;

  constructor(state, decksRelevants, gridsRelevants, mouseInput
  ) {
    super(state, mouseInput);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridsRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;


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
      gridRelevants = 
        board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND];
        
    } else {
      gridRelevants = 
      board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS],
      ]
    } else {
      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS],
    ]
    }

    const discardPhase = new DiscardCardPhase(
      DiscardCardState.INIT,
      deckRelevants,
      gridRelevants,
      mouseInput
    );

    return discardPhase;
  }

  execute() {
    let isPhaseFinished = false;
    switch (this._state) {
      case DiscardCardState.INIT:
        this.#initializePhase();
        break;

      case DiscardCardState.SELECT_CARD_TO_DISCARD:
        this.#selectCardToDiscard();
        break;

      case DiscardCardState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;

      default:
        console.error("Discard Event State Fail");
    }
    return isPhaseFinished;
  }

  #initializePhase() {
    globals.currentPhase = PhaseType.DISCARD_CARD;
    globals.currentState = DiscardCardState.SELECT_CARD_TO_DISCARD;
    this._state = DiscardCardState.SELECT_CARD_TO_DISCARD;
  }

  #selectCardToDiscard() {
    console.log("select card phase");
    const handGrid = this.#gridsRelevants;
    for (let i = 0; i < handGrid.getBoxes().length; i++) {
      let box = handGrid.getBoxes()[i];
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
      let cardBox = this.#selectedCard.getBoxIsPositionedIn(handGrid, this.#selectedCard)
      for (let i = 0; i < handGrid.getBoxes().length; i++) {
        let box = handGrid.getBoxes()[i];
        if(cardBox === box)
        {
          
          this.#decksRelevants[0].getCards().splice(i,1)
          console.log(this.#decksRelevants[1].getCards().length)
          this.#decksRelevants[1].getCards().push(this.#selectedCard)
          console.log(this.#decksRelevants[1].getCards().length)
          this._state = DiscardCardState.END;
        }
      }
    }
  }

  #finalizePhase() {
    console.log("finish phase");

      this.#selectedCard = null;
      this.#selectedGrid = null;
      this._state = DiscardCardState.INIT;
      

  }

}
