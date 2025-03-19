import InitialPhase from "./InitialPhase.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import MovePhase from "./MovePhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import {
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

    this.#numOfExecutedPhases++;

    if (this.#numOfExecutedPhases === 5) {
      globals.isCurrentTurnFinished = true;
    }
  }
}
