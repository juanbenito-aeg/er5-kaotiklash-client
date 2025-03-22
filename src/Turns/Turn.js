import InitialPhase from "./InitialPhase.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import MovePhase from "./MovePhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import {
  CardState,
  DeckType,
  DiscardCardState,
  DrawCardState,
  MovePhaseState,
  PlayerID,
  PrepareEventState,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class Turn {
  #numOfExecutedPhases;
  #phases;
  #deckContainer;
  #board;
  #mouseInput;
  #player;

  constructor(deckContainer, board, mouseInput, player) {
    this.#numOfExecutedPhases = 0;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.#player = player;
  }

  fillPhases() {
    if (this.#player.getID() === PlayerID.PLAYER_1) {
      const initialPhase = new InitialPhase(this.#deckContainer);
      initialPhase.execute();
    }

    const gameDecks = this.#deckContainer.getDecks();

    // TODO: FILL ARRAYS
    const decksRelevantToDrawCardPhase = [];
    const decksRelevantToPrepareEventPhase = [];
    const decksRelevantToPerformEventPhase = [
      gameDecks[DeckType.PLAYER_1_ACTIVE_EVENTS],
      gameDecks[DeckType.PLAYER_2_ACTIVE_EVENTS],
      gameDecks[DeckType.PLAYER_1_MINIONS_IN_PLAY],
      gameDecks[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];
    const decksRelevantToMovePhase = [];
    const decksRelevantToAttackPhase = [];
    const decksRelevantToDiscardCardPhase = [];

    const gameGrids = this.#board.getGrids();

    // TODO: FILL ARRAYS
    const gridsRelevantToDrawCardPhase = [];
    const gridsRelevantToPrepareEventPhase = [];
    const gridsRelevantToPerformEventPhase = [];
    const gridsRelevantToMovePhase = [];
    const gridsRelevantToAttackPhase = [];
    const gridsRelevantToDiscardCardPhase = [];

    if (this.#player.getID() === PlayerID.PLAYER_1) {
      // TODO: TO BE COMPLETED

      decksRelevantToPerformEventPhase.push(
        gameDecks[DeckType.PLAYER_1_EVENTS_IN_PREPARATION]
      );
    } else {
      // TODO: TO BE COMPLETED

      decksRelevantToPerformEventPhase.push(
        gameDecks[DeckType.PLAYER_2_EVENTS_IN_PREPARATION]
      );
    }

    const decksRelevantToPhases = [
      decksRelevantToDrawCardPhase,
      decksRelevantToPrepareEventPhase,
      decksRelevantToPerformEventPhase,
      decksRelevantToMovePhase,
      decksRelevantToAttackPhase,
      decksRelevantToDiscardCardPhase,
    ];

    const gridsRelevantToPhases = [
      gridsRelevantToDrawCardPhase,
      gridsRelevantToPrepareEventPhase,
      gridsRelevantToPerformEventPhase,
      gridsRelevantToMovePhase,
      gridsRelevantToAttackPhase,
      gridsRelevantToDiscardCardPhase,
    ];

    const drawCardPhase = new DrawCardPhase(
      DrawCardState.INIT,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );
    const prepareEventPhase = new PrepareEventPhase(
      PrepareEventState.INIT,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );
    const performEventPhase = new PerformEventPhase(
      0 /* TO BE CHANGED */,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );
    const movePhase = new MovePhase(
      MovePhaseState.INIT,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );
    const attackPhase = new AttackPhase(
      0 /* TO BE CHANGED */,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );
    const discardCardPhase = new DiscardCardPhase(
      DiscardCardState.INIT,
      this.#deckContainer,
      this.#board,
      this.#mouseInput
    );

    this.#phases = [
      drawCardPhase,
      prepareEventPhase,
      performEventPhase,
      movePhase,
      attackPhase,
      discardCardPhase,
    ];

    for (let i = 0; i < this.#phases.length; i++) {
      const currentPhase = this.#phases[i];

      for (let j = 0; j < decksRelevantToPhases[i].length; j++) {
        currentPhase.addDeck(decksRelevantToPhases[i][j]);
      }

      for (let j = 0; j < gridsRelevantToPhases[i].length; j++) {
        currentPhase.addGrid(gridsRelevantToPhases[i][j]);
      }
    }
  }

  changeTurn(currentPlayer) {
    this.#numOfExecutedPhases = 0;

    if (currentPlayer === 0) {
      return 1;
    } else {
      return 0;
    }
  }

  execute() {
    let currentPhase;

    if (this.#numOfExecutedPhases < this.#phases.length) {
      currentPhase = this.#phases[this.#numOfExecutedPhases];
    }

    currentPhase.execute();

    // this.#numOfExecutedPhases++;

    if (this.#numOfExecutedPhases === 5) {
      globals.isCurrentTurnFinished = true;
    }

    this.#expandCard();
  }

  #expandCard() {
    const decksToCheck = [];

    if (this.#player.getID() === PlayerID.PLAYER_1) {
      decksToCheck.push(
        DeckType.PLAYER_1_ACTIVE_EVENTS,
        DeckType.PLAYER_1_CARDS_IN_HAND,
        DeckType.PLAYER_1_EVENTS_IN_PREPARATION,
        DeckType.PLAYER_1_MAIN_CHARACTER,
        DeckType.PLAYER_1_MINIONS_IN_PLAY
      );
    } else {
      decksToCheck.push(
        DeckType.PLAYER_2_ACTIVE_EVENTS,
        DeckType.PLAYER_2_CARDS_IN_HAND,
        DeckType.PLAYER_2_EVENTS_IN_PREPARATION,
        DeckType.PLAYER_2_MAIN_CHARACTER,
        DeckType.PLAYER_2_MINIONS_IN_PLAY
      );
    }

    decksToCheck.push(DeckType.JOSEPH);

    const hoveredCard = this.#lookForHoveredCard(decksToCheck);

    this.#lookForCardThatIsntHoveredAnymore(decksToCheck);

    this.#lookForRightClickedCard(decksToCheck, hoveredCard);
  }

  #lookForHoveredCard(decksToCheck) {
    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          const hoveredCard = currentDeck.lookForHoveredCard(this.#mouseInput);

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

  #lookForCardThatIsntHoveredAnymore(decksToCheck) {
    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          const notHoveredCard = currentDeck.lookForCardThatIsntHoveredAnymore(
            this.#mouseInput
          );

          if (notHoveredCard) {
            notHoveredCard.setState(notHoveredCard.getPreviousState());
          }
        }
      }
    }
  }

  #lookForRightClickedCard(decksToCheck, hoveredCard) {
    if (this.#mouseInput.isRightButtonPressed() && hoveredCard) {
      this.#mouseInput.setRightButtonPressedFalse();

      const isAnyCardExpanded = this.#checkIfAnyCardIsExpanded(decksToCheck);

      for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
        for (let j = 0; j < decksToCheck.length; j++) {
          if (i === decksToCheck[j]) {
            const currentDeck = this.#deckContainer.getDecks()[i];

            for (let k = 0; k < currentDeck.getCards().length; k++) {
              const currentCard = currentDeck.getCards()[k];

              if (
                currentCard.getState() === CardState.EXPANDED &&
                currentCard === hoveredCard
              ) {
                currentCard.setState(currentCard.getPreviousState());
              } else if (!isAnyCardExpanded && currentCard === hoveredCard) {
                currentCard.setState(CardState.EXPANDED);
              }
            }
          }
        }
      }
    }
  }

  #checkIfAnyCardIsExpanded(decksToCheck) {
    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          const isAnyCardExpanded = currentDeck.checkIfAnyCardIsExpanded();

          if (isAnyCardExpanded) {
            return true;
          }
        }
      }
    }
  }
}
