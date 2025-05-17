import Particle from "./Particle.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";
import { ParticleID, ParticleState, PlayerID } from "../Game/constants.js";

export default class MainCharacterParticle extends Particle {
  #angle;
  #fadeCounter;
  #currentPlayerID;
  #radius;

  constructor(
    id,
    state,
    xCoordinate,
    yCoordinate,
    physics,
    alpha,
    radius,
    angle,
    currentPlayerID
  ) {
    super(id, state, xCoordinate, yCoordinate, physics, alpha);

    this.#angle = angle;
    this.#fadeCounter = 0;
    this.#radius = radius;
    this.#currentPlayerID = currentPlayerID;
  }

  static create(particles, num, box, currentPlayerID) {
    const centerX = box.getXCoordinate() + box.getWidth() / 2;
    const centerY = box.getYCoordinate() + box.getHeight() / 2;
    const radius = Math.max(box.getWidth(), box.getHeight()) / 2 + 10;

    for (let i = 0; i < num; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distanceFromCenter = radius + Math.random() * 15;

      const x = centerX + distanceFromCenter * Math.cos(angle);
      const y = centerY + distanceFromCenter * Math.sin(angle);

      const velocity = Math.random() * 15 + 5;
      const physics = new Physics(velocity, 0);

      const particle = new MainCharacterParticle(
        ParticleID.MAIN_CHARACTER,
        ParticleState.SPAWN,
        x,
        y,
        physics,
        1.0,
        radius,
        angle,
        currentPlayerID
      );

      particles.push(particle);
    }
  }

  update(currentPlayerID) {
    this.#fadeCounter += globals.deltaTime;

    if (this._state === ParticleState.SPAWN && this.#fadeCounter >= 0.5) {
      this._state = ParticleState.ON;
    }

    if (
      this.#currentPlayerID !== currentPlayerID &&
      this._state === ParticleState.ON
    ) {
      this._state = ParticleState.FADE;
    }

    if (this._state === ParticleState.FADE) {
      this._alpha -= 0.03;
      if (this._alpha <= 0) {
        this._state = ParticleState.OFF;
      }
    }

    const speed = 2;
    this.#angle += 0.05 * globals.deltaTime;
    this._xCoordinate += Math.cos(this.#angle) * speed * globals.deltaTime;
    this._yCoordinate += Math.sin(this.#angle) * speed * globals.deltaTime;
  }

  render() {
    globals.ctx.save();
    globals.ctx.globalAlpha = this._alpha;

    if (this._state === ParticleState.SPAWN) {
      globals.ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
    } else {
      globals.ctx.fillStyle = `rgba(255, 165, 0, 0.8)`;
    }
    globals.ctx.beginPath();
    globals.ctx.arc(this._xCoordinate, this._yCoordinate, 3, 0, 2 * Math.PI);
    globals.ctx.fill();

    globals.ctx.restore();
  }
}
