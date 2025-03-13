import Phase from "./Phase.js";

export default class MovePhase extends Phase{
    #currentPlayerMovementGridDeck;
    #currentPlayerMovementGrid;

    constructor(currentPlayerMovementGridDeck, currentPlayerMovementGrid){
        this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
        this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    }

    create() {
        
    }
}