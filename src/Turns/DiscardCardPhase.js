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
  #activePlayer;

  constructor(state, decksRelevants, gridsRelevants, mouseInput, activePlayer) {
    super(state, mouseInput);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridsRelevants;
    this.#selectedCard = null;
    this.#selectedGrid = null;
    this.#activePlayer = activePlayer;


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
    let activePlayer;
    if (player === currentPlayer) {
      gridRelevants = 
        board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND];
        
    } else {
      gridRelevants = 
      board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      activePlayer = PlayerID.PLAYER_1

      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS],
      ]
    } else {
      activePlayer = PlayerID.PLAYER_2

      deckRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS],
    ]
    }
    console.log(activePlayer)
    const discardPhase = new DiscardCardPhase(
      DiscardCardState.INIT,
      deckRelevants,
      gridRelevants,
      mouseInput,
      activePlayer
    );

    return discardPhase;
  }

  execute() {
    let isPhaseFinished = false;
    switch (this._state) {
      case DiscardCardState.INIT:
        this.#initializePhase();
        break;

      case DiscardCardState.CARD_DISCARD:
        if(this.#decksRelevants[0].getCards().length > 5) {
          this.#autoCardDiscard();
        } else if(this.#decksRelevants[0].getCards().length <= 5 && this.#decksRelevants[0].getCards().length > 3) {
          this.#cardDiscard();
        } else {
          this._state = DiscardCardState.END;
        }

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
    globals.currentState = DiscardCardState.CARD_DISCARD;
    this._state = DiscardCardState.CARD_DISCARD;
  }

  #autoCardDiscard() {
    console.log("discard card phase");
    const handGrid = this.#gridsRelevants;
    let index = this.#decksRelevants[0].getCards().length - 1;

    let box = handGrid.getBoxes()[index];
    console.log(handGrid)
    this.#selectedCard = box.getCard();

    if (this.#selectedCard) {

    this.#decksRelevants[1].insertCard(this.#selectedCard)
    this.#decksRelevants[0].removeCard(this.#selectedCard)
    box.resetCard()

    this.#selectedCard = null;
    this.#selectedGrid = null;
    this._state = DiscardCardState.INIT
          
    }
  }

  #cardDiscard() {
    console.log("select card to discard phase");
    const handGrid = this.#gridsRelevants;
    for (let i = 0; i < handGrid.getBoxes().length; i++) {
      let box = handGrid.getBoxes()[i];
      if (
        this._mouseInput.isMouseOverBox(box) &&
        box.isOccupied() &&
        this._mouseInput.isLeftButtonPressed()
      ) {
        this.#selectedCard = box.getCard();
      }
      if (this.#selectedCard) {
        console.log("selected card");
        
        this.#decksRelevants[1].insertCard(this.#selectedCard)
        this.#decksRelevants[0].removeCard(this.#selectedCard)
        box.resetCard()
        console.log(this.#decksRelevants[0])
        
        this.#selectedCard = null;
        this.#selectedGrid = null;
        this._state = DiscardCardState.END
      }
    }
  }

  #finalizePhase() {
    console.log("finish phase");
    
      this.#selectedCard = null;
      this.#selectedGrid = null;
      this._state = DiscardCardState.INIT;
  }

  reset() {
    this._state = DiscardCardState.INIT;

    this.#selectedCard = null;
    this.#selectedGrid = null;
  }
}