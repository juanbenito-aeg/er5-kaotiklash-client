import Event from "./Event.js";

export default class BroomFuryEvent extends Event {
  #isAttackBoostApplied;
  #currentPlayerMinionsDeck;
  #currentPlayerMinionsInPlayDeck;

  constructor(
    executedBy,
    eventCard,
    currentPlayerMinionsDeck,
    currentPlayerMinionsInPlayDeck
  ) {
    super(executedBy, eventCard);

    this.#isAttackBoostApplied = false;
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
