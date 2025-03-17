import Phase from "./Phase.js";
import { PrepareEventState, CardState, BoxState } from "../Game/constants.js";

export default class PrepareEvent extends Phase {
  // #cardsInHandDeck;
  // #cardsInHandGrid;
  // #eventsPreparationDeck;
  // #eventsPrepationFGrid;
  // #state;
  // #selectedCard;

  constructor(
    /* cardsInHandDeck,
    cardsInHandGrid,
    eventsPreparationDeck,
    eventsPrepationFGrid */

    state,
    deckContainer,
    board,
    mouseInput
  ) {
    // this.#cardsInHandDeck = cardsInHandDeck;
    // this.#cardsInHandGrid = cardsInHandGrid;
    // this.#eventsPreparationDeck = eventsPreparationDeck;
    // this.#eventsPrepationFGrid = eventsPrepationFGrid;
    // this.#state = PrepareEventState.INIT;
    // this.#selectedCard = null;

    super(state, deckContainer, board, mouseInput);
  }

  execute() {
    //   if (this.#state === PrepareEventState.INIT) {
    //     for (let i = 0; i < this.#cardsInHandDeck.length; i++) {
    //       this.#cardsInHandDeck[i].state = CardState.NOT_SELECTED;
    //     }
    //     this.#state = PrepareEventState.SELECT_HAND_CARD;
    //   }
    //   if (this.#state === PrepareEventState.SELECT_HAND_CARD) {
    //     for (let i = 0; i < this.#cardsInHandDeck.length; i++) {
    //       if (this.#cardsInHandDeck[i].isClicked) {
    //         this.#selectedCard = this.#cardsInHandDeck[i];
    //         this.#selectedCard.state = CardState.SELECTED;
    //         this.#state = PrepareEventState.SELECT_TARGET_GRID;
    //         return;
    //       }
    //     }
    //   }
    //   if (this.#state === PrepareEventState.SELECT_TARGET_GRID) {
    //     //FIND AN EMPTY BOX IN THE EVENT TO SETUP GRID
    //     for (let i = 0; i < this.#eventsPrepationFGrid.boxes.length; i++) {
    //       let box = this.#eventsPrepationFGrid.boxes[i];
    //       if (box.isClicked && box.state === BoxState.EMPTY) {
    //         box.state = BoxState.OCCUPIED;
    //         this.#selectedCard.state = CardState.PLACED;
    //         this.#eventsPreparationDeck.push(this.#selectedCard);
    //         for (let j = 0; j < this.#cardsInHandDeck.length; j++) {
    //           if (this.#cardsInHandDeck[j] === this.#selectedCard) {
    //             this.#cardsInHandDeck.splice(j, 1);
    //             return;
    //           }
    //         }
    //         this.#state = PrepareEventState.END;
    //       }
    //     }
    //   }
  }
}
