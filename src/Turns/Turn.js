import { globals } from "../index.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import MovePhase from "./MovePhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import InitialPhase from "./InitialPhase.js";
import { GameState } from "../Game/constants.js";

export default class Turn {
  #phases;
  #numOfExceccutePhase;
  #deckContainer;
  #board;
  #mouseInput;

  constructor(phases, deckContainer, board, mouseInput, player) {
    this.#phases = phases;
    this.#numOfExceccutePhase = 0;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.player = player;
  }

  create() {
 /*    const prepareEvent = new PrepareEventPhase();
    const performEvent = new PerformEventPhase();
    const movePhase = new MovePhase();
    const drawCardPhase = new DrawCardPhase();
    const discardCard = new DiscardCardPhase();
    const attack = new AttackPhase(); */
    console.log("banana")
    const initialPhase = new InitialPhase(this.#deckContainer);
    globals.gameState = GameState.DEAL_CARDS;
    initialPhase.execute();
  
    
    /* this.#phases = [
      drawCardPhase,
      prepareEvent,
      performEvent,
      movePhase,
      attack,
      discardCard,
    ]; */
  }
  
  execute() {
    



   /*  const currentPhase = -1;
    if (this.#numOfExceccutePhase < this.#phases) {
      currentPhase = this.#phases[this.#numOfExceccutePhase];
    }

    currentPhase.execute();

    this.#numOfExceccutePhase++;

    if (this.#numOfExceccutePhase === 5) {
      globals.isFinished = true;
      this.changeTurn(this.player);
    }
  }

  changeTurn(player) {
    if (globals.isFinished) {
      globals.isFinished = false;
      this.#numOfExceccutePhase = 0;
      return true;
    }
    return false; */
  }
}
