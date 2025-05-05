import Event from "./Event.js";
import globals from "../Game/globals.js";
import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

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
            "20px MedievalSharp",
            "red",
            1,
            1,
            minion.getXCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .width /
                2,
            minion.getYCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .height /
                2,
            0.5,
            new Physics(0, 0, 0, 0, 0, 0, 0)
          )
        );
      }
    }
    this.#stateMessages.push(
      new StateMessage(
        "ARMOR HALVED",
        "40px MedievalSharp",
        "red",
        1,
        1,
        1200,
        520,
        0.5,
        new Physics(0, 0, 0, 0, 0, 0, 0),
      )
    );
  }
}
