export default class SpecialSkillXG {
  #currentPlayerMinionsInPlayDeck;

  constructor(currentPlayerMinionsInPlayDeck) {
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
  }

  execute() {
    const minions = this.#currentPlayerMinionsInPlayDeck.getCards();

    for (let i = 0; i < minions.length; i++) {
      const minion = minions[i];

      const madness = minion.getCurrentMadness();
      const strength = minion.getCurrentStrength();
      minion.setCurrentMadness(madness * 1.75);
      minion.setCurrentStrength(strength * 1.75);

      let attack = (strength + madness) / 2;
      let defense = minion.getInitialConstitution() - madness / 2;
      minion.setCurrentAttack(attack);
      minion.setCurrentDefense(defense);
    }
  }
}
