import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class CurseOfTheBoundTitanEvent extends Event {
  constructor(
    executedBy,
    eventCard
  ) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.curseOfTheBoundTitanEventData.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      globals.curseOfTheBoundTitanEventData.isPlayer2Affected = true;
    } else {
      globals.curseOfTheBoundTitanEventData.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      globals.curseOfTheBoundTitanEventData.isActive = false;

      globals.curseOfTheBoundTitanEventData.isPlayer1Affected = false;

      globals.curseOfTheBoundTitanEventData.isPlayer2Affected = false;
    }
  }
}
