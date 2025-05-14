import Particle from "./Particle.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";
import { ParticleID, ParticleState, PlayerID } from "../Game/constants.js";

export default class MainCharacterParticle extends Particle {
  #angle;
  #fadeCounter;
  #currentPlayer;
  #radius;
  #baseSize;

  constructor(
    id,
    state,
    xCoordinate,
    yCoordinate,
    physics,
    alpha,
    radius,
    angle,
    currentPlayer
  ) {
    super(id, state, xCoordinate, yCoordinate, physics, alpha);
    this.#angle = angle;
    this.#fadeCounter = 0;
    this.#radius = radius;
    this.#currentPlayer = currentPlayer;
    this.#baseSize = 3 + Math.random();
  }

  static create(particles, num, box, currentPlayer) {
    const centerX = box.getXCoordinate() + box.getWidth() / 2;
    const centerY = box.getYCoordinate() + box.getHeight() / 2;
    const radius = Math.max(box.getWidth(), box.getHeight()) / 2 + 10;

    for (let i = 0; i < num; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distanceFromCenter = radius + Math.random() * 15;

      const x = centerX + distanceFromCenter * Math.cos(angle);
      const y = centerY + distanceFromCenter * Math.sin(angle);

      const physics = new Physics(0, 0);

      const particle = new MainCharacterParticle(
        ParticleID.MAIN_CHARACTER,
        ParticleState.SPAWN,
        x,
        y,
        physics,
        1.0,
        radius,
        angle,
        currentPlayer
      );

      particles.push(particle);
    }
  }

  update(currentPlayer) {
    this.#fadeCounter += globals.deltaTime;

    if (this._state === ParticleState.SPAWN && this.#fadeCounter >= 0.5) {
      this._state = ParticleState.ON;
    }

    if (
      this.#currentPlayer !== currentPlayer &&
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
  }

  render() {
    globals.ctx.save();
    globals.ctx.globalAlpha = this._alpha;

    const scale = 1 + 0.3 * Math.sin(this.#fadeCounter * 3);
    const radius = this.#baseSize * scale;

    const hue = (this.#fadeCounter * 60) % 360;
    const color =
      this._state === ParticleState.SPAWN
        ? `hsl(${hue}, 100%, 85%)`
        : `hsl(${hue}, 100%, 60%)`;

    globals.ctx.fillStyle = color;
    globals.ctx.beginPath();
    globals.ctx.arc(
      this._xCoordinate,
      this._yCoordinate,
      radius,
      0,
      2 * Math.PI
    );
    globals.ctx.fill();

    globals.ctx.restore();
  }
}
