import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";

export default class JudgmentAncientsEvent extends Event {
  #eventsData;

  constructor(executedBy, eventCard, eventsData) {
    super(executedBy, eventCard);

    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.judgmentAncients.isActive = true;

    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      this.#eventsData.judgmentAncients.affectedPlayerID = PlayerID.PLAYER_2;
    } else {
      this.#eventsData.judgmentAncients.affectedPlayerID = PlayerID.PLAYER_1;
    }

    if (!this.isActive()) {
      this.#eventsData.judgmentAncients.isActive = false;

      this.#eventsData.judgmentAncients.affectedPlayerID = -1;
    }
  }
}
