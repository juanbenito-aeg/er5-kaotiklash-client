import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import StateMessage from "../Messages/StateMessage.js";

export default class CurseOfTheBoundTitanEvent extends Event {
  #eventsData;
  #stateMessages;
  constructor(executedBy, eventCard, eventsData, stateMessages) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
    this.#stateMessages = stateMessages;
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

      const restoreMessage = new StateMessage(
        "MINION RESTORED",
        "35px MedievalSharp",
        "blue",
        2,
        1200,
        570
      );
      this.#stateMessages.push(restoreMessage);
    }
  }
}
