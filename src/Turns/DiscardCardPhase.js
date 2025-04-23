import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import globals from "../Game/globals.js";
import {
  DiscardCardState,
  CardState,
  GridType,
  PlayerID,
  DeckType,
} from "../Game/constants.js";

export default class DiscardCardPhase extends Phase {
  #decksRelevants;
  #gridsRelevants;

  constructor(state, mouseInput, phaseMessage, decksRelevants, gridsRelevants) {
    super(state, mouseInput, phaseMessage);

    this.#decksRelevants = decksRelevants;
    this.#gridsRelevants = gridsRelevants;
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
    let gridsRelevants;

    if (player === currentPlayer) {
      gridsRelevants = [board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND]];
    } else {
      gridsRelevants = [board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND]];
    }
    gridsRelevants.push(board.getGrids()[GridType.EVENTS_DECK]);

    if (player.getID() === PlayerID.PLAYER_1) {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
      ];
    } else {
      decksRelevants = [
        deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
      ];
    }
    decksRelevants.push(deckContainer.getDecks()[DeckType.EVENTS]);

    const discardPhase = new DiscardCardPhase(
      DiscardCardState.INIT,
      mouseInput,
      phaseMessage,
      decksRelevants,
      gridsRelevants
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
        if (
          this.#decksRelevants[0].getCards().length >= 4 &&
          this.#decksRelevants[0].getCards().length <= 6
        ) {
          if (this.#decksRelevants[0].getCards().length === 6) {
            this._phaseMessage.setCurrentContent(
              PhaseMessage.content.discardCard.mandatoryDiscard[
                globals.language
              ]
            );
          } else {
            this._phaseMessage.setCurrentContent(
              PhaseMessage.content.discardCard.optionalDiscard[globals.language]
            );
          }

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
    this.resetXDeckCardsToYState(this.#decksRelevants[0], CardState.PLACED);

    this._state = DiscardCardState.CARD_DISCARD;
  }

  #cardDiscard() {
    console.log("select card to discard phase");

    const hoveredCard = this.#decksRelevants[0].lookForHoveredCard();

    if (hoveredCard) {
      if (!hoveredCard.isLeftClicked()) {
        hoveredCard.setState(CardState.HOVERED);
      } else {
        const selectedCard = hoveredCard;

        const boxEventCardWasPositionedIn = selectedCard.getBoxIsPositionedIn(
          this.#gridsRelevants[0],
          selectedCard
        );
        boxEventCardWasPositionedIn.resetCard();

        this.#decksRelevants[1].insertCard(selectedCard);
        this.#decksRelevants[0].removeCard(selectedCard);

        selectedCard.setState(CardState.INACTIVE);

        this._state = DiscardCardState.END;
      }
    }
  }

  #finalizePhase() {
    console.log("finish phase");

    this._state = DiscardCardState.INIT;
  }
}
