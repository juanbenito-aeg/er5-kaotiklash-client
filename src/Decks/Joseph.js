import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Joseph extends Card {
  #category = CardCategory.EVENT;
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
