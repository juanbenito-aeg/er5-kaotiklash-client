import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";

export default class CurseOfTheBoundTitanEvent extends Event {
  #eventsData;
  constructor(executedBy, eventCard, eventsData) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.curseOfTheBoundTitan.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      this.#eventsData.curseOfTheBoundTitan.isPlayer2Affected = true;
    } else {
      this.#eventsData.curseOfTheBoundTitan.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      this.#eventsData.curseOfTheBoundTitan.isActive = false;

      this.#eventsData.curseOfTheBoundTitan.isPlayer1Affected = false;

      this.#eventsData.curseOfTheBoundTitan.isPlayer2Affected = false;
    }
  }
}
