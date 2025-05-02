import Card from "./Card.js";
import globals from "../Game/globals.js";
import { Language } from "../Game/constants.js";

export default class Special extends Card {
  #effect;
  #initialDurationInRounds;
  #currentDurationInRounds;
  #initialPrepTimeInRounds;
  #currentPrepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    effect,
    initialDurationInRounds,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#effect = effect;
    this.#initialDurationInRounds = this.#currentDurationInRounds =
      initialDurationInRounds;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getEffect() {
    return this.#effect;
  }

  renderEffect() {
    const effectString =
      globals.language === Language.ENGLISH ? "Effect:" : "Efektua:";
    globals.ctx.fillText(effectString, globals.canvas.width / 2, 730);

    this.#effect.render();
  }

  getInitialDurationInRounds() {
    return this.#initialDurationInRounds;
  }

  getCurrentDurationInRounds() {
    return this.#currentDurationInRounds;
  }

  setCurrentDurationInRounds(newDuration) {
    this.#currentDurationInRounds = newDuration;
  }

  getInitialPrepTimeInRounds() {
    return this.#initialPrepTimeInRounds;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }

  setCurrentPrepTimeInRounds(newPrepTimeInRounds) {
    this.#currentPrepTimeInRounds = newPrepTimeInRounds;
  }

  resetAttributes() {
    this.#currentDurationInRounds = this.#initialDurationInRounds;
    this.#currentPrepTimeInRounds = this.#initialPrepTimeInRounds;
  }
}
