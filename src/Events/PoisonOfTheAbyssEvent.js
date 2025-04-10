import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class PoisonOfTheAbyssEvent extends Event {
  constructor(
    executedBy,
    eventCard
  ) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.poisonOfTheAbyssEventData.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      globals.poisonOfTheAbyssEventData.isPlayer1Affected = true;
    } else {
      globals.poisonOfTheAbyssEventData.isPlayer2Affected = true;
    }

    if (!this.isActive()) {
      globals.poisonOfTheAbyssEventData.isActive = false;

      globals.poisonOfTheAbyssEventData.isPlayer1Affected = false;

      globals.poisonOfTheAbyssEventData.isPlayer2Affected = false;
    }
  }
}
