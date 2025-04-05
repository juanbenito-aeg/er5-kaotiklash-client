export default class Phase {
  _state;
  _mouseInput;
  _phaseMessage;

  constructor(state, mouseInput, phaseMessage) {
    this._state = state;
    this._mouseInput = mouseInput;
    this._phaseMessage = phaseMessage;
  }

  static create() {}

  execute() {}

  resetXDeckCardsToYState(deck, stateToSet, stateNotToOverWrite = -1) {
    for (let i = 0; i < deck.getCards().length; i++) {
      const currentCard = deck.getCards()[i];

      if (currentCard.getState() !== stateNotToOverWrite) {
        currentCard.setState(stateToSet);
      }
    }
  }

  resetXGridBoxesToYState(grid, stateToSet, stateNotToOverWrite = -1) {
    for (let i = 0; i < grid.getBoxes().length; i++) {
      const currentBox = grid.getBoxes()[i];

      if (currentBox.getState() !== stateNotToOverWrite) {
        currentBox.setState(stateToSet);
      }
    }
  }

  reset() {}
}
