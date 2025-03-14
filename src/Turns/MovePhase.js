import Phase from "./Phase.js";
import {MovePhaseState, CardState, BoxState} from "../Game/constants.js";

export default class MovePhase extends Phase{
    #currentPlayerMovementGridDeck;
    #currentPlayerMovementGrid;ç
    #selectedCard;
    #state;

    constructor(currentPlayerMovementGridDeck, currentPlayerMovementGrid){
        this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
        this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
        this.#selectedCard = null;
        this.#state = MovePhaseState.INIT;
    }

    execute() {
        if (this.#state === MovePhaseState.INIT) {
            this.#state = MovePhaseState.SELECT_CARD;
        }

        if (this.#state === MovePhaseState.SELECT_CARD) {
            for (let i = 0; i < this.#currentPlayerMovementGridDeck.length; i++) {
                let card = this.#currentPlayerMovementGridDeck[i];
                if (card.isClicked) {
                    this.#selectedCard = card;
                    this.#selectedCard.state = CardState.SELECTED;
                    this.#state = MovePhaseState.SELECT_TARGET;
                }
            }
        }

        if (this.#state === MovePhaseState.SELECT_TARGET) {
            for (let i = 0; i < this.#currentPlayerMovementGrid.boxes.length; i++) {
                let box = this.#currentPlayerMovementGrid.boxes[i];
                if (box.isClicked && box.state === BoxState.EMPTY) {
                    this.#state = MovePhaseState.MOVE_CARD;
                    this.moveCardToBox(box);
                }
            }
        }

        if (this.#state === MovePhaseState.MOVE_CARD) {
            this.#state = MovePhaseState.END;
        }
    }

    moveCardToBox(targetBox) {
        if (this.#selectedCard) {
            this.#selectedCard.xCoordinate = targetBox.xCoordinate;
            this.#selectedCard.yCoordinate = targetBox.yCoordinate;
            this.#selectedCard.state = CardState.PLACED;
            targetBox.state = BoxState.OCCUPIED;
        }
    }
}