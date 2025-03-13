import { globals } from "../index.js";
export default class Turn{
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
        
    }

    execute() {
        if(this.#numOfExceccutePhase < this.#phases.length){
            const currentPhase = this.#phases[this.#numOfExceccutePhase];
        }

        //PHASE'S LOGIC

        this.#numOfExceccutePhase++;

        if(this.#numOfExceccutePhase === this.#phases.length){
            globals.isFinished= true;
            this.changeTurn(this.player);
        }
    }

    changeTurn(player) {
        if (globals.isFinished){
            globals.isFinished = false;
            return true;
        }
        return false;
    }
}