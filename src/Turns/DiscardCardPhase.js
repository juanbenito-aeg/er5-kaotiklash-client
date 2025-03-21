import Phase from "./Phase.js";
import { DiscardCardState, CardState, BoxState } from "../Game/constants.js";

export default class DiscardCardPhase extends Phase {
  // #cardsInHandDeck;
  // #cardsInHandGrid;
  // #eventsDeck;
  // #eventDeckGrid;
  // #state;
  // #skipButtonPressed;

  constructor(
    /* cardsInHandDeck,
    cardsInHandGrid,
    eventsDeck,
    eventDeckGrid,
    skipButtonPressed */

    state,
    deckContainer,
    board,
    mouseInput
  ) {
    // this.#cardsInHandDeck = cardsInHandDeck;
    // this.#cardsInHandGrid = cardsInHandGrid;
    // this.#eventsDeck = eventsDeck;
    // this.#eventDeckGrid = eventDeckGrid;
    // this.#skipButtonPressed = skipButtonPressed;
    // this.#state = DiscardCardState.INIT;

    super(state, deckContainer, board, mouseInput);
  }

  execute() {
    // if (this.#state === DiscardCardState.INIT) {
    //   // SKIP PHASE
    //   if (this.#skipButtonPressed) {
    //     this.#state = DiscardCardState.END;
    //     return;
    //   }
    //   this.#state = DiscardCardState.SELECT_CARD_TO_DISCARD;
    // }
    // if (this.#state === DiscardCardState.SELECT_CARD_TO_DISCARD) {
    //   for (let i = 0; i < this.#cardsInHandGrid.boxes.length; i++) {
    //     let box = this.#cardsInHandGrid.boxes[i];
    //     if (box.isClicked && box.state === BoxState.OCCUPIED) {
    //       let cardToDiscard = null;
    //       for (let j = 0; j < this.#cardsInHandDeck.length; j++) {
    //         if (this.#cardsInHandDeck[j].box === box) {
    //           cardToDiscard = this.#cardsInHandDeck[j];
    //         }
    //       }
    //       if (cardToDiscard) {
    //         cardToDiscard.state = CardState.DISCARDED;
    //         this.#eventsDeck.push(cardToDiscard);
    //         box.state = BoxState.EMPTY;
    //         for (let k = 0; k < this.#cardsInHandDeck.length; k++) {
    //           if (this.#cardsInHandDeck[k] === cardToDiscard) {
    //             this.#cardsInHandDeck.splice(k, 1);
    //             return;
    //           }
    //         }
    //         this.#state = DiscardCardState.END;
    //       }
    //     }
    //   }
    // }
  }
}
