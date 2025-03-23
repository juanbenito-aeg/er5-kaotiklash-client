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
  GridType,
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
    const decksRelevantToPrepareEventPhase = [
/*       gameDecks[DeckType.PLAYER_1_CARDS_IN_HAND],
      gameDecks[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      gameDecks[DeckType.PLAYER_2_CARDS_IN_HAND],
      gameDecks[DeckType.PLAYER_2_EVENTS_IN_PREPARATION], */

    ];
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
    const gridsRelevantToPrepareEventPhase = [
      gameGrids[GridType.PLAYER_1_CARDS_IN_HAND],
      gameGrids[GridType.PLAYER_2_CARDS_IN_HAND],
      gameGrids[GridType.PLAYER_1_PREPARE_EVENT],
      gameGrids[GridType.PLAYER_2_PREPARE_EVENT],
    ];
    const gridsRelevantToPerformEventPhase = [];
    const gridsRelevantToMovePhase = [];
    const gridsRelevantToAttackPhase = [];
    const gridsRelevantToDiscardCardPhase = [];

    if (this.#player.getID() === PlayerID.PLAYER_1) {
      // TODO: TO BE COMPLETED
      decksRelevantToPrepareEventPhase.push(
        gameDecks[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
        gameDecks[DeckType.PLAYER_1_CARDS_IN_HAND]
      );
      gridsRelevantToPerformEventPhase.push(
        gameGrids[GridType.PLAYER_1_CARDS_IN_HAND],
        gameGrids[GridType.PLAYER_1_PREPARE_EVENT],
      )
      decksRelevantToPerformEventPhase.push(
        gameDecks[DeckType.PLAYER_1_EVENTS_IN_PREPARATION]
      );

    } else {
      // TODO: TO BE COMPLETED
      decksRelevantToPrepareEventPhase.push(
        gameDecks[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
        gameDecks[DeckType.PLAYER_2_CARDS_IN_HAND]
      );

      gridsRelevantToPerformEventPhase.push(
        gameGrids[GridType.PLAYER_2_CARDS_IN_HAND],
        gameGrids[GridType.PLAYER_2_PREPARE_EVENT],
      );
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
      decksRelevantToPrepareEventPhase,
      gameGrids,
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

    /* currentPhase.execute(); */
    this.#checkButtonClick();

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

    const hoveredCardData = this.#checkIfMouseOverAnyCard(decksToCheck);
    this.#checkIfRightClickWasPressedOnCard(decksToCheck, hoveredCardData);
  }

  #checkIfMouseOverAnyCard(decksToCheck) {
    let hoveredCardData;

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          hoveredCardData = currentDeck.checkIfMouseOverAnyCard(
            this.#mouseInput
          );

          if (hoveredCardData.isAnyCardHovered) {
            return hoveredCardData;
          }
        }
      }
    }

    return hoveredCardData;
  }

  #checkIfRightClickWasPressedOnCard(decksToCheck, hoveredCardData) {
    if (
      this.#mouseInput.isRightButtonPressed() &&
      hoveredCardData.isAnyCardHovered
    ) {
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
                currentCard === hoveredCardData.hoveredCard
              ) {
                currentCard.setState(currentCard.getPreviousState());
              } else if (
                !isAnyCardExpanded &&
                currentCard === hoveredCardData.hoveredCard
              ) {
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

          if (currentDeck.checkIfAnyCardIsExpanded()) {
            return true;
          }
        }
      }
    }
  }

  #checkButtonClick() {
    const mouseX = this.#mouseInput.getMouseXCoordinate();
    const mouseY = this.#mouseInput.getMouseYCoordinate();
    
    if (this.#mouseInput.isLeftButtonPressed()) {
    for (let i = 0; i < globals.buttonDataGlobal.length; i++) {
      const buttonData = globals.buttonDataGlobal[i];
      const buttonX = buttonData[0];
      const buttonY = buttonData[1];
      const buttonWidth = buttonData[2];
      const buttonHeight = buttonData[3];
      const phase = buttonData[4];

      if (  mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
          mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            this.#executePhase(i);
            break;
        }
      }
    }
  }

  #executePhase(phase) {
    if(phase >= 0 && phase < this.#phases.length) {
      const currentPhase = this.#phases[phase];
      currentPhase.execute();
    }
  }
}
