import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
import globals from "../Game/globals.js";

export default class BroomFuryEvent extends Event {
  #isAttackBoostApplied;
  #stateMessages;
  #currentPlayerMinionsDeck;
  #currentPlayerMinionsInPlayDeck;

  constructor(
    executedBy,
    eventCard,
    stateMessages,
    currentPlayerMinionsDeck,
    currentPlayerMinionsInPlayDeck
  ) {
    super(executedBy, eventCard);

    this.#isAttackBoostApplied = false;
    this.#stateMessages = stateMessages;
    this.#currentPlayerMinionsDeck = currentPlayerMinionsDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    const minionsDecks = [
      this.#currentPlayerMinionsDeck,
      this.#currentPlayerMinionsInPlayDeck,
    ];

    for (let i = 0; i < minionsDecks.length; i++) {
      const currentMinionsDeck = minionsDecks[i];

      for (let j = 0; j < currentMinionsDeck.getCards().length; j++) {
        const currentMinion = currentMinionsDeck.getCards()[j];

        if (!this.#isAttackBoostApplied) {
          currentMinion.setCurrentAttack(currentMinion.getInitialAttack() * 2);

          // STATE MESSAGE CREATION

          const x2AttackMsgXCoordinate =
            currentMinion.getXCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width /
              2;

          const x2AttackMsgYCoordinate =
            currentMinion.getYCoordinate() +
            globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height /
              2;

          const x2AttackMsg = new StateMessage(
            "x2 ATK",
            "20px MedievalSharp",
            "rgb(240 167 163)",
            4,
            x2AttackMsgXCoordinate,
            x2AttackMsgYCoordinate
          );

          this.#stateMessages.push(x2AttackMsg);

          if (
            i === minionsDecks.length - 1 &&
            j === currentMinionsDeck.getCards().length - 1
          ) {
            this.#isAttackBoostApplied = true;
          }
        } else if (!this.isActive()) {
          currentMinion.setCurrentAttack(currentMinion.getInitialAttack());
        }
      }
    }
  }
}
