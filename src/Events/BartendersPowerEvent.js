import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
import { AnimationTypeID } from "../Game/constants.js";
export default class BartendersPowerEvent extends Event {
  #currentPlayerMinionsInPlayDeck;
  #stateMessage;
  #isFinished;

  constructor(
    executedBy,
    eventCard,
    currentPlayerMinionsInPlayDeck,
    stateMessage
  ) {
    super(executedBy, eventCard);
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#stateMessage = stateMessage;
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

        const attack = minion.getCurrentAttack();
        const defense = minion.getCurrentDefense();

        minion.setCurrentAttack(attack + 7);
        minion.setCurrentDefense(defense + 7);
        let message = new StateMessage(
          "+7",
          `50px MedievalSharp`,
          "red",
          5,
          minion.getXCoordinate(),
          minion.getYCoordinate(),
          AnimationTypeID.BOOST
        );
        this.#stateMessage.push(message);
      }
    }
    this.#isFinished = true;
    if (!this.isActive()) {
      this.#restoreMinionsInPlay();
    }
  }

  #restoreMinionsInPlay() {
    const minions = this.#currentPlayerMinionsInPlayDeck.getCards();

    for (let i = 0; i < minions.length; i++) {
      const minion = minions[i];

      const attack = minion.getInitialAttack();
      const defense = minion.getInitialDefense();

      minion.setCurrentAttack(attack);
      minion.setCurrentDefense(defense);
    }
  }
}
