export default class SpecialSkillXG {
  #currentPlayerMinionsInPlayDeck;
  #isFinished;

  constructor(currentPlayerMinionsInPlayDeck) {
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#isFinished = false;
  }

  execute() {
    const minions = this.#currentPlayerMinionsInPlayDeck.getCards();

    if (!this.#isFinished) {
      for (let i = 0; i < minions.length; i++) {
        const minion = minions[i];

        const madness = minion.getCurrentMadness();
        const strength = minion.getCurrentStrength();

        const newMadness = Math.ceil(madness * 1.75);
        const newStrength = Math.ceil(strength * 1.75);

        minion.setCurrentMadness(newMadness);
        minion.setCurrentStrength(newStrength);

        let attack = Math.ceil((newStrength + newMadness) / 2);

        let defense = Math.max(
          1,
          Math.ceil(minion.getInitialConstitution() - madness / 2)
        );

        minion.setCurrentAttack(attack);
        minion.setCurrentDefense(defense);
      }
      this.#isFinished = true;
    }
  }

  restoreMinionStats() {
    const minions = this.#currentPlayerMinionsInPlayDeck.getCards();

    for (let i = 0; i < minions.length; i++) {
      const minion = minions[i];

      const madness = minion.getInitialMadness();
      const strength = minion.getInitialStrength();

      minion.setCurrentMadness(madness);
      minion.setCurrentStrength(strength);

      let attack = minion.getInitialAttack();
      let defense = minion.getInitialConstitution();

      minion.setCurrentAttack(attack);
      minion.setCurrentDefense(defense);
    }
  }
}
