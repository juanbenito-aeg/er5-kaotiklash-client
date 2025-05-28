import Card from "./Card.js";
import globals from "../Game/globals.js";
import { Language } from "../Game/constants.js";

export default class Joseph extends Card {
  #chaoticEventID;
  #chaoticEventName;
  #chaoticEventDescription;
  #durationInRounds;

  constructor(
    category,
    id,
    name,
    description,
    chaoticEventID,
    chaoticEventName,
    chaoticEventDescription,
    durationInRounds
  ) {
    super(category, id, name, description);

    this.#chaoticEventID = chaoticEventID;
    this.#chaoticEventName = chaoticEventName;
    this.#chaoticEventDescription = chaoticEventDescription;
    this.#durationInRounds = durationInRounds;
  }

  getChaoticEventName() {
    return this.#chaoticEventName;
  }

  getChaoticEventDescription() {
    return this.#chaoticEventDescription;
  }

  renderChaoticEventDescription() {
    const chaoticEventString =
      globals.language === Language.ENGLISH
        ? "Chaotic Event: "
        : "Gertaera Kaotikoa: ";
    globals.ctx.fillText(
      chaoticEventString + this.#chaoticEventName,
      globals.canvas.width / 2,
      787
    );

    this.#chaoticEventDescription.render();
  }

  getCurrentDurationInRounds() {
    return this.#durationInRounds;
  }

  setCurrentDurationInRounds(newDuration) {
    this.#durationInRounds = newDuration;
  }
}
