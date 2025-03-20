import Phase from "./Phase.js";
import { CardState, DrawCardState, BoxState } from "../Game/constants.js";

export default class DrawCardPhase extends Phase {
  #eventsDeck;
  #eventsDeckGrid;
  #cardsInHandDeck;
  #cardsInHandGrid;
  #state;

  constructor(eventsDeck, eventsDeckGrid, cardsInHandDeck, cardsInHandGrid) {
    super();
    
    this.#eventsDeck = eventsDeck;
    this.#eventsDeckGrid = eventsDeckGrid;
    this.#cardsInHandDeck = cardsInHandDeck;
    this.#cardsInHandGrid = cardsInHandGrid;
    this.#state = DrawCardState.INIT;
  }

  execute() {
    if (this.#state === DrawCardState.INIT) {
      this.#state = DrawCardState.DRAW_CARD;
    }

    if (this.#state === DrawCardState.DRAW_CARD) {
      if (this.#eventsDeck.length > 0) {
        let drawnCard = this.#eventsDeck[0];
        this.#eventsDeck.splice(0, 1);
        drawnCard.state = CardState.NOT_SELECTED;

        let cardFoundInGrid = false;
        for (let i = 0; i < this.#eventsDeckGrid.length; i++) {
          let gridCard = this.#eventsDeckGrid[i];
          if (gridCard === drawnCard) {
            gridCard.state = CardState.NOT_SELECTED;
            this.#eventsDeckGrid.splice(i, 1);
            cardFoundInGrid = true;
          }
        }

        if (cardFoundInGrid) {
          for (let i = 0; i < this.#cardsInHandGrid.boxes.length; i++) {
            let box = this.#cardsInHandGrid.boxes[i];
            if (box.state === BoxState.EMPTY) {
              this.#cardsInHandDeck.push(drawnCard);
              box.state = BoxState.OCCUPIED;
              drawnCard.state = CardState.PLACED;
            }
          }
        }
      }

      this.#state = DrawCardState.END;
    }
  }
}
