import { globals } from "../index.js";
import StateMessage from "../Messages/StateMessage.js";
import Event from "./Event.js";

export default class MarchOfTheLastSighEvent extends Event {
  #currentPlayerMinionsInPlayDeck;
  #stateMessages;
  #isFinished;

  constructor(
    executeBy,
    eventCard,
    currentPlayerMinionsInPlayDeck,
    stateMessages
  ) {
    super(executeBy, eventCard);
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#stateMessages = stateMessages;
    this.#isFinished = false;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    if (!this.#isFinished) {
      for (
        let i = 0;
        i < this.#currentPlayerMinionsInPlayDeck.getCards().length;
        i++
      ) {
        const minion = this.#currentPlayerMinionsInPlayDeck.getCards()[i];

        const minionAttack = minion.getCurrentAttack();

        minion.setCurrentAttack(minionAttack + 20);

        let message = new StateMessage(
          "+20 ATK",
          "20px MedievalSharp",
          "green",
          2,
          minion.getXCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width /
              2,
          minion.getYCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height /
              2
        );
        this.#stateMessages.push(message);
        this.#isFinished = true;
      }
    }

    if (!this.isActive()) {
      this.#restore();
    }
  }

  #restore() {
    const minions = this.#currentPlayerMinionsInPlayDeck.getCards();

    for (let i = 0; i < minions.length; i++) {
      const minion = minions[i];

      const attack = minion.getInitialAttack();

      minion.setCurrentAttack(attack);
    }
  }
}
