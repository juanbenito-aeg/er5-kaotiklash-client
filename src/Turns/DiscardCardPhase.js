import Phase from "./Phase.js";
import { DiscardCardState, CardState, BoxState } from "../Game/constants.js";

export default class DiscardCardPhase extends Phase{
    #cardsInHandDeck;
    #cardsInHandGrid;
    #eventsDeck;
    #eventDeckGrid;
    #state;
    #skipButtonPressed; 

    constructor(cardsInHandDeck, cardsInHandGrid, eventsDeck, eventDeckGrid, skipButtonPressed){
        this.#cardsInHandDeck = cardsInHandDeck;
        this.#cardsInHandGrid = cardsInHandGrid;
        this.#eventsDeck = eventsDeck;
        this.#eventDeckGrid = eventDeckGrid;
        this.#skipButtonPressed = skipButtonPressed;
        this.#state = DiscardCardState.INIT;
    }

    execute() {
        if (this.#state === DiscardCardState.INIT) {
            // SKIP PHASE
            if (this.#skipButtonPressed) {
                this.#state = DiscardCardState.END;
                return;
            }

            this.#state = DiscardCardState.SELECT_CARD_TO_DISCARD; 
        }

        if (this.#state === DiscardCardState.SELECT_CARD_TO_DISCARD) {
            for (let i = 0; i < this.#cardsInHandGrid.boxes.length; i++) {
                let box = this.#cardsInHandGrid.boxes[i];
                if (box.isClicked && box.state === BoxState.OCCUPIED) {
                    let cardToDiscard = null;
                    for (let j = 0; j < this.#cardsInHandDeck.length; j++) {
                        if (this.#cardsInHandDeck[j].box === box) {
                            cardToDiscard = this.#cardsInHandDeck[j]; 
                            return;
                        }
                    }

                    if (cardToDiscard) {
                        cardToDiscard.state = CardState.NOT_SELECTED;

                        // Mover la carta al mazo de eventos
                        this.#eventsDeck.push(cardToDiscard);

                        // Limpiar la caja y cambiar el estado
                        box.state = BoxState.EMPTY;

                        // Eliminar la carta del mazo de cartas en mano (usando un for)
                        for (let k = 0; k < this.#cardsInHandDeck.length; k++) {
                            if (this.#cardsInHandDeck[k] === cardToDiscard) {
                                this.#cardsInHandDeck.splice(k, 1); // Eliminar la carta del mazo de cartas en mano
                                break;
                            }
                        }

                        this.#state = PhaseState.END; // Finalizar la fase de descarte
                    }
                }
            }
        }
    }
}