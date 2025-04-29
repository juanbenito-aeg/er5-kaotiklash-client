import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";

export default class TheCupOfTheLastBreathEvent extends Event {
  #eventsData;
  constructor(executedBy, eventCard, eventsData) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.theCupOfTheLastBreath.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      this.#eventsData.theCupOfTheLastBreath.isPlayer2Affected = true;
    } else {
      this.#eventsData.theCupOfTheLastBreath.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      this.#eventsData.theCupOfTheLastBreath.isActive = false;

      this.#eventsData.theCupOfTheLastBreath.isPlayer1Affected = false;

      this.#eventsData.theCupOfTheLastBreath.isPlayer2Affected = false;
    }
  }
}
