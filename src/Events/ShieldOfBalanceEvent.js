import Event from "./Event.js";

export default class ShieldOfBalanceEvent extends Event {
  #eventsData;
  constructor(executeBy, eventCard, eventsData) {
    super(executeBy, eventCard);
    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.shieldOfBalanceActive = true;
    this.#eventsData.shieldOfBalanceOwner = this._executedBy.getID();

    if (!this.isActive()) {
      this.#eventsData.shieldOfBalanceOwner = null;
      this.#eventsData.shieldOfBalanceActive = false;
    }
  }
}
