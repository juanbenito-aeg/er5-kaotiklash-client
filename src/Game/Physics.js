export default class Physics {
  #vx;
  #vy;
  #vLimit;
  #ax;
  #ay;
  #aLimit;

  constructor(vLimit, aLimit) {
    this.#vx = 0; // CURRENT VELOCITY IN THE X-AXIS (PX/SECOND)
    this.#vy = 0; // CURRENT VELOCITY IN THE Y-AXIS (PX/SECOND)
    this.#vLimit = vLimit; // MAXIMUM VELOCITY AT WHICH THE USER OF THIS CLASS CAN MOVE (PX/SECOND)
    this.#ax = 0; // ACCELERATION ALONG THE X-AXIS
    this.#ay = 0; // ACCELERATION ALONG THE Y-AXIS
    this.#aLimit = aLimit; // ACCELERATION LIMIT (DEFAULT IS 0, MEANING NO ACCELERATION)
  }

  getVX() {
    return this.#vx;
  }

  setVX(vx) {
    this.#vx = vx;
  }

  getVY() {
    return this.#vy;
  }

  setVY(vy) {
    this.#vy = vy;
  }

  getVLimit() {
    return this.#vLimit;
  }

  getAX() {
    return this.#ax;
  }

  setAX(ax) {
    this.#ax = ax;
  }

  getAY() {
    return this.#ay;
  }

  setAY(ay) {
    this.#ay = ay;
  }

  getALimit() {
    return this.#aLimit;
  }
}
