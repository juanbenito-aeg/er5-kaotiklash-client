import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";

export default class RayOfCelestialRuinEvent extends Event {
  #currentEnemyMinionsInPlay;
  #stateMessages;

  constructor(executeBy, eventCard, currentEnemyMinionInPlay, stateMessages) {
    super(executeBy, eventCard);

    this.#currentEnemyMinionsInPlay = currentEnemyMinionInPlay;
    this.#stateMessages = stateMessages;
  }

  execute() {
    const enemyMinions = this.#currentEnemyMinionsInPlay.getCards();

    for (let i = 0; i < enemyMinions.length; i++) {
      const minion = enemyMinions[i];

      if (minion.getArmor()) {
        const originalDurability = minion.getArmor().getCurrentDurability();
        const newDurability = Math.max(1, Math.floor(originalDurability / 2));

        minion.getArmor().setCurrentDurability(newDurability);

        let msg = new StateMessage(
          `-${newDurability}`,
          "30px MedievalSharp",
          "rgb(85 202 255)",
          1,
          2,
          minion.getXCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width /
              2,
          minion.getYCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height /
              2,
          1,
          new Physics(0, 0)
        );

        msg.setVY(20);

        this.#stateMessages.push(msg);
      }
    }

    let msg = new StateMessage(
      "THE DURABILITY OF ENEMY MINIONS' ARMOR WAS HALVED",
      "30px MedievalSharp",
      "red",
      1,
      2,
      globals.canvas.width / 2,
      globals.canvas.height / 2,
      1,
      new Physics(0, 0)
    );

    msg.setVY(20);

    this.#stateMessages.push(msg);
  }
}
