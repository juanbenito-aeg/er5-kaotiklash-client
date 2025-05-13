export default class Particle {
  _id;
  _state;
  _xCoordinate;
  _yCoordinate;
  _physics;
  _alpha;

  constructor(id, state, xCoordinate, yCoordinate, physics, alpha) {
    this._id = id;
    this._state = state;
    this._xCoordinate = xCoordinate;
    this._yCoordinate = yCoordinate;
    this._physics = physics;
    this._alpha = alpha;
  }

  static create() {}

  update() {}

  render() {}

  getState() {
    return this._state;
  }
}
