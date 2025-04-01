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
    console.log(this.#activePlayer)
    switch (this._state) {
      case DiscardCardState.INIT:

        this.#initializePhase();
        break;

      case DiscardCardState.CARD_DISCARD:

          this.#CardDiscard();

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

  #CardDiscard() {
    console.log("discard card phase");
    const handGrid = this.#gridsRelevants;
    let index = this.#decksRelevants[0].getCards().length - 1;


        

    
    let box = handGrid.getBoxes()[index];
    console.log(handGrid)
    this.#selectedCard = box.getCard();

    if (this.#selectedCard) {
      console.log("selected card");



          this.#decksRelevants[1].insertCard(this.#selectedCard)
          this.#decksRelevants[0].removeCard(this.#selectedCard)
          console.log(this.#decksRelevants[0])
          if(this.#decksRelevants[0].getCards().length < 6)
          {
            console.log("all needed cards discarded")
            this._state = DiscardCardState.END;
          } else {
            console.log("card discarded but not yet")
            this.#selectedCard = null;
            this.#selectedGrid = null;
            this._state = DiscardCardState.INIT
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