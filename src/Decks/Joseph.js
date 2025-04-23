import Card from "./Card.js";

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

  getCurrentDurationInRounds() {
    return this.#durationInRounds;
  }

  setCurrentDurationInRounds(newDuration) {
    this.#durationInRounds = newDuration;
  }
}
