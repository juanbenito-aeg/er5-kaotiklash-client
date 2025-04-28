import Event from "./Event.js";
import { PlayerID } from "../Game/constants.js";

export default class PoisonOfTheAbyssEvent extends Event {
  #eventsData;

  constructor(executedBy, eventCard, eventsData) {
    super(executedBy, eventCard);
    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    this.#eventsData.poisonOfTheAbyss.isActive = true;
    if (this._executedBy.getID() === PlayerID.PLAYER_1) {
      console.log("Player 2 is affected by Poison of the Abyss");
      this.#eventsData.poisonOfTheAbyss.isPlayer2Affected = true;
    } else {
      console.log("Player 1 is affected by Poison of the Abyss");
      this.#eventsData.poisonOfTheAbyss.isPlayer1Affected = true;
    }

    if (!this.isActive()) {
      this.#eventsData.poisonOfTheAbyss.isActive = false;

      this.#eventsData.poisonOfTheAbyss.isPlayer1Affected = false;

      this.#eventsData.poisonOfTheAbyss.isPlayer2Affected = false;
    }
  }
}
