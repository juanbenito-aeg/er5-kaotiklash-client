export default class Phase {
  _state;
  _mouseInput;

  constructor(state, mouseInput) {
    this._state = state;
    this._mouseInput = mouseInput;
  }

  static create() {}

  execute() {}

  reset() {}
}
