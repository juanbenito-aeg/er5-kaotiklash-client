import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class TheCupOfTheLastBreathEvent extends Event {
  constructor(
    executedBy,
    eventCard
  ) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.theCupOfTheLastBreathEventData.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      globals.theCupOfTheLastBreathEventData.isPlayer2Affected = true;
    } else {
      globals.theCupOfTheLastBreathEventData.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      globals.theCupOfTheLastBreathEventData.isActive = false;

      globals.theCupOfTheLastBreathEventData.isPlayer1Affected = false;

      globals.theCupOfTheLastBreathEventData.isPlayer2Affected = false;
    }
  }
}
