import Particle from "./Particle.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";
import { ParticleID, ParticleState } from "../Game/constants.js";

export default class MinionDeathParticle extends Particle {
  #width;
  #height;
  #fadeCounter;
  #timeToFade;

  constructor(
    id,
    state,
    xCoordinate,
    yCoordinate,
    physics,
    alpha,
    width,
    height,
    timeToFade
  ) {
    super(id, state, xCoordinate, yCoordinate, physics, alpha);

    this.#width = width;
    this.#height = height;
    this.#fadeCounter = 0;
    this.#timeToFade = timeToFade;
  }

  static create(particles, numOfParticlesToCreate, deadMinion) {
    const initialXCoordinate =
      deadMinion.getXCoordinate() +
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2;
    const initialYCoordinate =
      deadMinion.getYCoordinate() +
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height / 2;

    const alpha = 1.0;
    const timeToFade = 1.25;

    for (let i = 0; i < numOfParticlesToCreate; i++) {
      const velocity = Math.random() * 25 + 10;
      const physics = new Physics(velocity, 60);

      const particle = new MinionDeathParticle(
        ParticleID.MINION_DEATH,
        ParticleState.ON,
        initialXCoordinate,
        initialYCoordinate,
        physics,
        alpha,
        7.5,
        7.5,
        timeToFade
      );

      const randomAngle = Math.random() * 2 * Math.PI;

      const vx = particle._physics.getVLimit() * Math.cos(randomAngle);
      particle._physics.setVX(vx);
      const vy = particle._physics.getVLimit() * Math.sin(randomAngle);
      particle._physics.setVY(vy);

      const ax = -particle._physics.getALimit() * Math.cos(randomAngle);
      particle._physics.setAX(ax);
      const ay = -particle._physics.getALimit() * Math.sin(randomAngle);
      particle._physics.setAY(ay);

      particles.push(particle);
    }
  }

  update() {
    this.#fadeCounter += globals.deltaTime;

    switch (this._state) {
      case ParticleState.ON:
        if (this.#fadeCounter >= this.#timeToFade) {
          this.#fadeCounter = 0;
          this._state = ParticleState.FADE;
        }
        break;

      case ParticleState.FADE:
        this._alpha -= 0.05;
        if (this._alpha <= 0) {
          this._state = ParticleState.OFF;
        }
        break;
    }

    const updatedVX =
      this._physics.getVX() + this._physics.getAX() * globals.deltaTime;
    this._physics.setVX(updatedVX);
    const updatedVY =
      this._physics.getVY() + this._physics.getAY() * globals.deltaTime;
    this._physics.setVY(updatedVY);

    this._xCoordinate += this._physics.getVX() * globals.deltaTime;
    this._yCoordinate += this._physics.getVY() * globals.deltaTime;
  }

  render() {
    globals.ctx.save();

    globals.ctx.globalAlpha = this._alpha;

    globals.ctx.fillStyle = "rgb(120 6 6)";
    globals.ctx.fillRect(
      this._xCoordinate,
      this._yCoordinate,
      this.#width,
      this.#height
    );

    globals.ctx.restore();
  }
}
