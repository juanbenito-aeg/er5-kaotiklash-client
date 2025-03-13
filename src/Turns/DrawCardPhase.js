import Phase from "./Phase.js";

export default class DrawCardPhase extends Phase{

    #eventsDeck;
    #eventsDeckGrid;
    #cardsInHandDeck;
    #cardsInHandGrid;

    constructor(eventsDeck, eventsDeckGrid, cardsInHandDeck, cardsInHandGrid){
        this.#eventsDeck = eventsDeck;
        this.#eventsDeckGrid = eventsDeckGrid;
        this.#cardsInHandDeck = cardsInHandDeck;
        this.#cardsInHandGrid = cardsInHandGrid;
    }

    create() {
        
    }

}