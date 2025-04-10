import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class JudgmentAncientsEvent extends Event {
  constructor(executedBy, eventCard) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.judgmentAncientsEventData.isActive = true;

    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      globals.judgmentAncientsEventData.affectedPlayerID = PlayerID.PLAYER_2;
    } else {
      globals.judgmentAncientsEventData.affectedPlayerID = PlayerID.PLAYER_1;
    }

    if (!this.isActive()) {
      globals.judgmentAncientsEventData.isActive = false;

      globals.judgmentAncientsEventData.affectedPlayerID = -1;
    }
  }
}
