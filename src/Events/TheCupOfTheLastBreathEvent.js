import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class TheCupOfTheLastBreathEvent extends Event {
  #eventsData;
  #stateMessages;
  #affectedPlayerName;
  #hasShowMessage;
  constructor(executedBy, eventCard, eventsData, stateMessages) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
    this.#stateMessages = stateMessages;
    this.#affectedPlayerName = null;
    this.#hasShowMessage = false;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.theCupOfTheLastBreath.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      this.#eventsData.theCupOfTheLastBreath.isPlayer2Affected = true;
    } else {
      this.#eventsData.theCupOfTheLastBreath.isPlayer1Affected = true;
    }

    const isAffectedPlayer = currentPlayer.getID() !== this._executedBy.getID();

    if (isAffectedPlayer & !this.#hasShowMessage) {
      this.#affectedPlayerName = currentPlayer.getName();
      const denyHealingMessage = new StateMessage(
        `${this.#affectedPlayerName.toUpperCase()} AND THEIR MINIONS CANNOT HEAL`,
        "40px MedievalSharp",
        "purple",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0)
      );

      denyHealingMessage.setVY(20);

      this.#stateMessages.push(denyHealingMessage);
      this.#hasShowMessage = true;
    }

    if (!this.isActive()) {
      this.#eventsData.theCupOfTheLastBreath.isActive = false;

      this.#eventsData.theCupOfTheLastBreath.isPlayer1Affected = false;

      this.#eventsData.theCupOfTheLastBreath.isPlayer2Affected = false;

      const healRestoredMessage = new StateMessage(
        `${this.#affectedPlayerName.toUpperCase()} CAN HEAL AGAIN`,
        "40px MedievalSharp",
        "green",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0)
      );

      healRestoredMessage.setVY(20);

      this.#stateMessages.push(healRestoredMessage);
    }
  }
}
