import Card from "./Card.js";

export default class Joseph extends Card {
  #chaoticEventID;
  #chaoticEventName;
  #chaoticEventDescription;

  constructor(
    category,
    id,
    name,
    description,
    chaoticEventID,
    chaoticEventName,
    chaoticEventDescription
  ) {
    super(category, id, name, description);

    this.#chaoticEventID = chaoticEventID;
    this.#chaoticEventName = chaoticEventName;
    this.#chaoticEventDescription = chaoticEventDescription;
  }

  getChaoticEventName() {
    return this.#chaoticEventName;
  }

  getChaoticEventDescription() {
    return this.#chaoticEventDescription;
  }
}
