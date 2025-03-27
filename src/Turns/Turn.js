import InitialPhase from "./InitialPhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import MovePhase from "./MovePhase.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import {
  PlayerID,
  CardState,
  DeckType,
  PhaseType,
  PhaseButton,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class Turn {
  #isCurrentPhaseFinished;
  #currentPhase;
  #numOfExecutedPhases;
  #phases;
  #deckContainer;
  #board;
  #mouseInput;
  #player;

  constructor(deckContainer, board, mouseInput, player) {
    this.#isCurrentPhaseFinished = false;
    this.#currentPhase = PhaseType.INVALID;
    this.#numOfExecutedPhases = 0;
    this.#phases = [];
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

    const phaseTypes = [
      DrawCardPhase,
      PrepareEventPhase,
      PerformEventPhase,
      MovePhase,
      AttackPhase,
      DiscardCardPhase,
    ];

    for (let i = 0; i < phaseTypes.length; i++) {
      const currentPhase = phaseTypes[i].create(
        this.#player,
        this.#deckContainer,
        this.#board,
        this.#mouseInput
      );

      this.#phases.push(currentPhase);
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
    const isAnyCardExpanded = this.#expandCard();

    if (this.#currentPhase === PhaseType.INVALID) {
      this.#checkButtonClick();
    } else if (!this.#isCurrentPhaseFinished) {
      this.#isCurrentPhaseFinished = this.#phases[this.#currentPhase].execute();

    }

    if (this.#isCurrentPhaseFinished) {
      this.#isCurrentPhaseFinished = false;
      this.#currentPhase = PhaseType.INVALID;
      this.#numOfExecutedPhases++;
    }
    if (!isAnyCardExpanded) {
      if (this.#currentPhase === PhaseType.INVALID) {
        this.#checkButtonClick();
      } else if (!this.#isCurrentPhaseFinished) {
        this.#isCurrentPhaseFinished =
          this.#phases[this.#currentPhase].execute();
      }

      if (this.#isCurrentPhaseFinished) {
        this.#isCurrentPhaseFinished = false;
        this.#currentPhase = PhaseType.INVALID;
        this.#numOfExecutedPhases++;
      }

      if (this.#numOfExecutedPhases === 5) {
        globals.isCurrentTurnFinished = true;
      }
    }
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

    this.#lookForRightClickedCard(decksToCheck);

    const isAnyCardExpanded = this.#checkIfAnyCardIsExpanded(decksToCheck);
    return isAnyCardExpanded;
  }

  #lookForRightClickedCard(decksToCheck) {
    if (this.#mouseInput.isRightButtonPressed()) {
      this.#mouseInput.setRightButtonPressedFalse();

      const isAnyCardExpanded = this.#checkIfAnyCardIsExpanded(decksToCheck);

      for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
        for (let j = 0; j < decksToCheck.length; j++) {
          if (i === decksToCheck[j]) {
            const currentDeck = this.#deckContainer.getDecks()[i];

            const hoveredCard = currentDeck.lookForHoveredCard(
              this.#mouseInput
            );

            for (let k = 0; k < currentDeck.getCards().length; k++) {
              const currentCard = currentDeck.getCards()[k];

              if (currentCard === hoveredCard) {
                if (!isAnyCardExpanded) {
                  currentCard.setPreviousState(currentCard.getState());
                  currentCard.setState(CardState.EXPANDED);
                } else if (currentCard.getState() === CardState.EXPANDED) {
                  currentCard.setState(currentCard.getPreviousState());
                }
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

  getnumOfExecutedPhases() {
    return this.#numOfExecutedPhases;
  }

  setnumOfExecutedPhases() {
    this.#numOfExecutedPhases++;
  }
  #checkButtonClick() {
    const mouseX = this.#mouseInput.getMouseXCoordinate();
    const mouseY = this.#mouseInput.getMouseYCoordinate();

    if (this.#mouseInput.isLeftButtonPressed()) {
      for (let i = 0; i < globals.buttonDataGlobal.length; i++) {
        const buttonData = globals.buttonDataGlobal[i];

        const buttonXCoordinate = buttonData[0];
        const buttonYCoordinate = buttonData[1];
        const buttonWidth = buttonData[2];
        const buttonHeight = buttonData[3];

        if (
          mouseX >= buttonXCoordinate &&
          mouseX <= buttonXCoordinate + buttonWidth &&
          mouseY >= buttonYCoordinate &&
          mouseY <= buttonYCoordinate + buttonHeight
        ) {
          if (i === PhaseButton.SKIP) {
            // TODO: INSERT METHOD THAT SKIPS CURRENT PHASE
          } else {
            this.#currentPhase = i;
          }
        }
      }
    }
  }
}
