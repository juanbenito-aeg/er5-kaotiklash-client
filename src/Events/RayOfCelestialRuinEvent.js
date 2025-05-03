import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
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

        this.#stateMessages.push(
          new StateMessage(
            `-${newDurability}`,
            "30px MedievalSharp",
            "rgb(85 202 255)",
            2,
            minion.getXCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .width /
                2,
            minion.getYCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .height /
                2
          )
        );
      }
    }

    this.#stateMessages.push(
      new StateMessage(
        "THE DURABILITY OF ENEMY MINIONS' ARMOR WAS HALVED",
        "30px MedievalSharp",
        "red",
        3,
        globals.canvas.width / 2,
        globals.canvas.height / 2
      )
    );
  }
}
