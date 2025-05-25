import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";
import globals from "../Game/globals.js";

export default class BroomFuryEvent extends Event {
  #isAttackBoostApplied;
  #stateMessages;
  #currentPlayerMinionsInPlayDeck;

  constructor(
    executedBy,
    eventCard,
    stateMessages,
    currentPlayerMinionsInPlayDeck
  ) {
    super(executedBy, eventCard);

    this.#isAttackBoostApplied = false;
    this.#stateMessages = stateMessages;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    for (
      let i = 0;
      i < this.#currentPlayerMinionsInPlayDeck.getCards().length;
      i++
    ) {
      const currentMinion = this.#currentPlayerMinionsInPlayDeck.getCards()[i];

      if (!this.#isAttackBoostApplied) {
        currentMinion.setCurrentAttack(currentMinion.getInitialAttack() * 2);

        // STATE MESSAGE CREATION

        const x2AttackMsgXCoordinate =
          currentMinion.getXCoordinate() +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2;

        const x2AttackMsgYCoordinate =
          currentMinion.getYCoordinate() +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height /
            2;

        const x2AttackMsg = new StateMessage(
          "x2 ATK",
          "20px MedievalSharp",
          "rgb(240 167 163)",
          1,
          2,
          x2AttackMsgXCoordinate,
          x2AttackMsgYCoordinate,
          1,
          new Physics(0, 0)
        );

        x2AttackMsg.setVY(20);

        this.#stateMessages.push(x2AttackMsg);

        if (i === this.#currentPlayerMinionsInPlayDeck.getCards().length - 1) {
          this.#isAttackBoostApplied = true;
        }
      } else if (!this.isActive()) {
        currentMinion.setCurrentAttack(currentMinion.getInitialAttack());
      }
    }
  }
}
