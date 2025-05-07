import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";
import StateMessage from "../Messages/StateMessage.js";

export default class CurseOfTheBoundTitanEvent extends Event {
  #eventsData;
  #stateMessages;
  #hasShownDebuffMessage;
  #affectedPlayerName;

  constructor(executedBy, eventCard, eventsData, stateMessages) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
    this.#stateMessages = stateMessages;
    this.#hasShownDebuffMessage = false;
    this.#affectedPlayerName = null;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    const isAffectedPlayer = currentPlayer.getID() !== this._executedBy.getID();

    this.#eventsData.curseOfTheBoundTitan.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      this.#eventsData.curseOfTheBoundTitan.isPlayer2Affected = true;
    } else {
      this.#eventsData.curseOfTheBoundTitan.isPlayer1Affected = true;
    }

    if (isAffectedPlayer && !this.#hasShownDebuffMessage) {
      this.#affectedPlayerName = currentPlayer.getName();

      const debuffMessage = new StateMessage(
        `${this.#affectedPlayerName.toUpperCase()}’S MINIONS DEAL 10 LESS DAMAGE`,
        "35px MedievalSharp",
        "darkred",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      debuffMessage.getPhysics().vy = 20;

      this.#stateMessages.push(debuffMessage);
      this.#hasShownDebuffMessage = true;
    }

    if (!this.isActive()) {
      this.#eventsData.curseOfTheBoundTitan.isActive = false;

      this.#eventsData.curseOfTheBoundTitan.isPlayer1Affected = false;

      this.#eventsData.curseOfTheBoundTitan.isPlayer2Affected = false;

      const restoreMessage = new StateMessage(
        `${this.#affectedPlayerName.toUpperCase()}’S MINIONS RECOVER FULL DAMAGE`,
        "35px MedievalSharp",
        "blue",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      restoreMessage.getPhysics().vy = 20;
      
      this.#stateMessages.push(restoreMessage);
    }
  }
}
