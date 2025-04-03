import Phase from "./Phase.js";
import {
  DiscardCardState,
  CardState,
  GridType,
  PlayerID,
  PhaseType,
  DeckType,
  BoxState,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class DiscardCardPhase extends Phase {
  #decksRelevants;
  #gridsRelevants;

  constructor(state, decksRelevants, gridsRelevants, mouseInput) {
    super(state, mouseInput);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridsRelevants;
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer
  ) {
    let decksRelevants;
    let gridRelevants;

    if (player === currentPlayer) {
      gridRelevants = board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND];
    } else {
      gridRelevants = board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND];
    }

    if (player.getID() === PlayerID.PLAYER_1) {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS]
      ];
    } else {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
        deckContainer.getDecks()[DeckType.EVENTS]
      ];
    }
    decksRelevants.push(deckContainer.getDecks()[DeckType.EVENTS]);

    const discardPhase = new DiscardCardPhase(
      DiscardCardState.INIT,
      decksRelevants,
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

        this.#resetRelevantCardsStates([
          this.#decksRelevants[0],
          this.#decksRelevants[1]
        ]);
        break;

      case DiscardCardState.CARD_DISCARD:
        console.log(this.#decksRelevants[0].getCards())
        if (this.#decksRelevants[0].getCards().length > 3) {
          this.#cardDiscard();
        } else {
          this._state = DiscardCardState.END;
        }
        break;

      case DiscardCardState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    globals.currentPhase = PhaseType.DISCARD_CARD;
    globals.currentState = DiscardCardState.CARD_DISCARD;

    this._state = DiscardCardState.CARD_DISCARD;
  }

  #cardDiscard() {
    console.log("select card to discard phase");
    
    const hoveredCard = this.#decksRelevants[0].lookForHoveredCard();
    
    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        hoveredCard.setState(CardState.SELECTED);
        const selectedCard = hoveredCard;
        
        const selectedBox = this.#gridsRelevants.lookForLeftClickedBox();
        this.#decksRelevants[1].insertCard(selectedCard);
        this.#decksRelevants[0].removeCard(selectedCard);
        selectedBox.resetCard();
        selectedBox.setState(BoxState.AVAILABLE)
        selectedCard.setState(CardState.INACTIVE);

        this._state = DiscardCardState.END;
      }
    }
  }

  #finalizePhase() {
    console.log("finish phase");
    this._state = DiscardCardState.INIT;
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
