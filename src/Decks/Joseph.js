import Card from "./Card.js";

export default class Joseph extends Card {
  #chaoticEventID;
  #chaoticEventName;
  #chaoticEventDescription;

  constructor(
    id,
    name,
    description,
    chaoticEventID,
    chaoticEventName,
    chaoticEventDescription
  ) {
    super(id, name, description);

    this.#chaoticEventID = chaoticEventID;
    this.#chaoticEventName = chaoticEventName;
    this.#chaoticEventDescription = chaoticEventDescription;
  }
}
