import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class JudgmentAncientsEvent extends Event {
  constructor(executedBy, eventCard) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.judgmentAncientsCardData.isEventActive = true;

    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      globals.judgmentAncientsCardData.affectedPlayerID = PlayerID.PLAYER_2;
    } else {
      globals.judgmentAncientsCardData.affectedPlayerID = PlayerID.PLAYER_1;
    }

    if (!this.isActive()) {
      globals.judgmentAncientsCardData.isEventActive = false;

      globals.judgmentAncientsCardData.affectedPlayerID = -1;
    }
  }
}
