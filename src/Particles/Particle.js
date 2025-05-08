export default class Particle {
  #id;
  _state;
  _xCoordinate;
  _yCoordinate;
  _physics;
  _alpha;

  constructor(id, state, xCoordinate, yCoordinate, physics, alpha) {
    this.#id = id;
    this._state = state;
    this._xCoordinate = xCoordinate;
    this._yCoordinate = yCoordinate;
    this._physics = physics;
    this._alpha = alpha;
  }

  static create() {}

  update() {}
}
