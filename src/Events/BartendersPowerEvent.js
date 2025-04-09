import Event from "./Event.js";
export default class BartendersPowerEvent extends Event {
  #currentPlayerMinionsInPlayDeck;
  #isFinished;

  constructor(executedBy, eventCard, currentPlayerMinionsInPlayDeck) {
    super(executedBy, eventCard);
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
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
