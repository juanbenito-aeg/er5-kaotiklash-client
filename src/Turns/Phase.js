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

  reset() {}
}
