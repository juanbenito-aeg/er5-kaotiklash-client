import Event from "./Event.js";
import globals from "../Game/globals.js";

export default class ShieldOfBalanceEvent extends Event {
  constructor(executeBy, eventCard) {
    super(executeBy, eventCard);
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    globals.shieldOfBalanceActive = true;
    globals.shieldOfBalanceOwner = this._executedBy.getID();

    if (!this.isActive()) {
      globals.shieldOfBalanceOwner = null;
      globals.shieldOfBalanceActive = false;
    }
  }
}
