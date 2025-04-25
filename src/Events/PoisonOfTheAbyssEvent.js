import Event from "./Event.js";
import globals from "../Game/globals.js";
import { PlayerID } from "../Game/constants.js";

export default class PoisonOfTheAbyssEvent extends Event {
  constructor(executedBy, eventCard) {
    super(executedBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.poisonOfTheAbyssEventData.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      console.log("Player 2 is affected by Poison of the Abyss");
      globals.poisonOfTheAbyssEventData.isPlayer2Affected = true;
    } else {
      console.log("Player 1 is affected by Poison of the Abyss");
      globals.poisonOfTheAbyssEventData.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      globals.poisonOfTheAbyssEventData.isActive = false;

      globals.poisonOfTheAbyssEventData.isPlayer1Affected = false;

      globals.poisonOfTheAbyssEventData.isPlayer2Affected = false;
    }
  }
}
