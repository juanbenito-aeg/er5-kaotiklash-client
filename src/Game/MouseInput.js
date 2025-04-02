import { CardCategory, CardState, BoxState } from "./constants.js";
import { globals } from "../index.js";

export default class MouseInput {
  #mouseXCoordinate;
  #mouseYCoordinate;
  #leftButtonPressed;
  #rightButtonPressed;

  constructor() {
    this.#mouseXCoordinate = 0;
    this.#mouseYCoordinate = 0;
    this.#leftButtonPressed = false;
    this.#rightButtonPressed = false;
  }

  addMouseEventListeners() {
    window.addEventListener("contextmenu", function (event) {
      // DISABLE THE CONTEXT-MENU FOR THE WHOLE PAGE
      event.preventDefault();
    });

    globals.canvas.addEventListener(
      "mousedown",
      this.canvasMouseDownHandler.bind(this),
      false
    );

    globals.canvas.addEventListener(
      "mouseup",
      this.canvasMouseUpHandler.bind(this),
      false
    );

    globals.canvas.addEventListener(
      "mousemove",
      this.canvasMouseMoveHandler.bind(this),
      false
    );
  }

  canvasMouseDownHandler(event) {
    if (event.button === 0) {
      this.#leftButtonPressed = true;
    } else if (event.button === 2) {
      this.#rightButtonPressed = true;
    }
  }

  canvasMouseUpHandler(event) {
    if (event.button === 0) {
      this.#leftButtonPressed = false;
    } else if (event.button === 2) {
      this.#rightButtonPressed = false;
    }
  }

  canvasMouseMoveHandler(event) {
    //FIND THE MOUSE'S X AND Y POSITIONS ON THE CANVAS
    this.#mouseXCoordinate = event.pageX - globals.canvas.offsetLeft;
    this.#mouseYCoordinate = event.pageY - globals.canvas.offsetTop;
  }

  getMouseXCoordinate() {
    return this.#mouseXCoordinate;
  }

  getMouseYCoordinate() {
    return this.#mouseYCoordinate;
  }

  isLeftButtonPressed() {
    return this.#leftButtonPressed;
  }

  isRightButtonPressed() {
    return this.#rightButtonPressed;
  }

  setLeftButtonPressedFalse() {
    this.#leftButtonPressed = false;
  }

  setRightButtonPressedFalse() {
    this.#rightButtonPressed = false;
  }

  detectMouseOverBox(board) {
    for (let i = 0; i < board.getGrids().length; i++) {
      const currentGrid = board.getGrids()[i];

      for (let j = 0; j < currentGrid.getBoxes().length; j++) {
        const currentBox = currentGrid.getBoxes()[j];

        const [isMouseWithinBoxWidth, isMouseWithinBoxHeight] =
          this.#checkIfMouseWithinBoxWidthAndHeight(currentBox);

        if (isMouseWithinBoxWidth && isMouseWithinBoxHeight) {
          currentBox.setIsMouseOver(true);
        }
      }
    }
  }

  #checkIfMouseWithinBoxWidthAndHeight(box) {
    const boxWidth = box.getWidth();
    const boxHeight = box.getHeight();

    const boxXCoordinate = box.getXCoordinate();
    const boxYCoordinate = box.getYCoordinate();

    const isMouseWithinBoxWidth =
      this.getMouseXCoordinate() >= boxXCoordinate &&
      this.getMouseXCoordinate() <= boxXCoordinate + boxWidth;

    const isMouseWithinBoxHeight =
      this.getMouseYCoordinate() >= boxYCoordinate &&
      this.getMouseYCoordinate() <= boxYCoordinate + boxHeight;

    return [isMouseWithinBoxWidth, isMouseWithinBoxHeight];
  }

  detectBoxThatIsntHoveredAnymore(board) {
    for (let i = 0; i < board.getGrids().length; i++) {
      const currentGrid = board.getGrids()[i];

      for (let j = 0; j < currentGrid.getBoxes().length; j++) {
        const currentBox = currentGrid.getBoxes()[j];

        const [isMouseWithinBoxWidth, isMouseWithinBoxHeight] =
          this.#checkIfMouseWithinBoxWidthAndHeight(currentBox);

        if (
          (!isMouseWithinBoxWidth || !isMouseWithinBoxHeight) &&
          currentBox.isMouseOver()
        ) {
          currentBox.setIsMouseOver(false);
        }
      }
    }
  }

  resetIsLeftClickedOnBoxes(board) {
    for (let i = 0; i < board.getGrids().length; i++) {
      const currentGrid = board.getGrids()[i];

      const leftClickedBox = currentGrid.lookForLeftClickedBox();

      if (leftClickedBox) {
        // SET "isLeftClicked" TO FALSE ON THE BOX THAT WAS LEFT-CLICKED IN THE PREVIOUS CYCLE
        leftClickedBox.setIsLeftClicked(false);
      }
    }
  }

  detectLeftClickOnBox(board) {
    if (this.isLeftButtonPressed()) {
      for (let i = 0; i < board.getGrids().length; i++) {
        const currentGrid = board.getGrids()[i];

        const hoveredBox = currentGrid.lookForHoveredBox();

        for (let j = 0; j < currentGrid.getBoxes().length; j++) {
          const currentBox = currentGrid.getBoxes()[j];

          if (currentBox === hoveredBox) {
            currentBox.setIsLeftClicked(true);
          }
        }
      }
    }
  }

  detectMouseOverCard(deckContainer) {
    for (let i = 0; i < deckContainer.getDecks().length; i++) {
      const currentDeck = deckContainer.getDecks()[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        const [isMouseWithinCardWidth, isMouseWithinCardHeight] =
          this.#checkIfMouseWithinCardWidthAndHeight(currentCard);

        if (isMouseWithinCardWidth && isMouseWithinCardHeight) {
          currentCard.setIsMouseOver(true);
        }
      }
    }
  }

  #checkIfMouseWithinCardWidthAndHeight(card) {
    let cardWidth = globals.imagesDestinationSizes.allCardsBigVersion.width;
    let cardHeight = globals.imagesDestinationSizes.allCardsBigVersion.height;

    let cardXCoordinate = globals.canvas.width / 2 - cardWidth / 2;
    let cardYCoordinate = globals.canvas.height / 2 - cardHeight / 2;

    if (card.getState() !== CardState.EXPANDED) {
      if (card.getCategory() === CardCategory.MAIN_CHARACTER) {
        cardWidth =
          globals.imagesDestinationSizes.mainCharactersSmallVersion.width;
        cardHeight =
          globals.imagesDestinationSizes.mainCharactersSmallVersion.height;
      } else {
        cardWidth =
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
        cardHeight =
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;
      }

      cardXCoordinate = card.getXCoordinate();
      cardYCoordinate = card.getYCoordinate();
    }

    const isMouseWithinCardWidth =
      this.getMouseXCoordinate() >= cardXCoordinate &&
      this.getMouseXCoordinate() <= cardXCoordinate + cardWidth;

    const isMouseWithinCardHeight =
      this.getMouseYCoordinate() >= cardYCoordinate &&
      this.getMouseYCoordinate() <= cardYCoordinate + cardHeight;

    return [isMouseWithinCardWidth, isMouseWithinCardHeight];
  }

  detectCardThatIsntHoveredAnymore(deckContainer) {
    for (let i = 0; i < deckContainer.getDecks().length; i++) {
      const currentDeck = deckContainer.getDecks()[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        const [isMouseWithinCardWidth, isMouseWithinCardHeight] =
          this.#checkIfMouseWithinCardWidthAndHeight(currentCard);

        if (
          (!isMouseWithinCardWidth || !isMouseWithinCardHeight) &&
          currentCard.isMouseOver()
        ) {
          currentCard.setIsMouseOver(false);
        }
      }
    }
  }

  resetIsLeftClickedOnCards(deckContainer) {
    for (let i = 0; i < deckContainer.getDecks().length; i++) {
      const currentDeck = deckContainer.getDecks()[i];

      const leftClickedCard = currentDeck.lookForLeftClickedCard();

      if (leftClickedCard) {
        // SET "isLeftClicked" TO FALSE ON THE CARD THAT WAS LEFT-CLICKED IN THE PREVIOUS CYCLE
        leftClickedCard.setIsLeftClicked(false);
      }
    }
  }

  detectLeftClickOnCard(deckContainer) {
    if (this.isLeftButtonPressed()) {
      for (let i = 0; i < deckContainer.getDecks().length; i++) {
        const currentDeck = deckContainer.getDecks()[i];

        const hoveredCard = currentDeck.lookForHoveredCard();

        for (let j = 0; j < currentDeck.getCards().length; j++) {
          const currentCard = currentDeck.getCards()[j];

          if (currentCard === hoveredCard) {
            currentCard.setIsLeftClicked(true);
          }
        }
      }

      this.setLeftButtonPressedFalse();
    }
  }
}
