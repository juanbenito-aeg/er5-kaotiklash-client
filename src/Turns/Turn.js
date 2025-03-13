export default class Turn{
    #phases;
    #numOfExceccutePhase;
    #deckContainer;
    #board;
    #mouseInput;
    #player; 
    #isTurnChange;

    constructor(phases, deckContainer, board, mouseInput, player) {
        this.#phases = phases;
        this.#numOfExceccutePhase = 0;
        this.#deckContainer = deckContainer;
        this.#board = board;
        this.#mouseInput = mouseInput;
        this.#player = player;
        this.#isTurnChange = false;
    }

    execute() {
        if(this.#numOfExceccutePhase < this.#phases.length){
            const currentPhase = this.#phases[this.#numOfExceccutePhase];
        }

        //PHASE'S LOGIC

        this.#numOfExceccutePhase++;

        if(this.#numOfExceccutePhase === this.#phases.length){
            this.#isTurnChange = true;
        }
    }

    changeTurn() {
        if (this.#isTurnChange){
            this.#isTurnChange = false;
            return true;
        }

        return false;
    }
}