import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class SpecialSkillXG {
  #currentPlayerMinionsInPlayDeck;
  #stateMessages;
  #isFinished;

  constructor(currentPlayerMinionsInPlayDeck, stateMessages) {
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#stateMessages = stateMessages;
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
          Math.ceil(minion.getCurrentDefense() - newMadness / 2)
        );

        minion.setCurrentAttack(attack);
        minion.setCurrentDefense(defense);
      }

      let message = new StateMessage(
        "MINIONS GOT CRAZY!!",
        "50px MedievalSharp",
        "blue",
        1,
        2,
        1200,
        520,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      this.#stateMessages.push(message);

      let attackMessage = new StateMessage(
        "ATTACK ↑",
        "40px MedievalSharp",
        "green",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      this.#stateMessages.push(attackMessage);

      let DefenseMessage = new StateMessage(
        "DEFENSE ↓",
        "40px MedievalSharp",
        "red",
        1,
        2,
        1200,
        630,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      this.#stateMessages.push(DefenseMessage);

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
      let defense = minion.getInitialDefense();

      minion.setCurrentAttack(attack);
      minion.setCurrentDefense(defense);
    }

    let restoreMessage = new StateMessage(
      "MINIONS CALM DOWN...",
      "50px MedievalSharp",
      "purple",
      2,
      1200,
      570
    );

    this.#stateMessages.push(restoreMessage);
  }
}
