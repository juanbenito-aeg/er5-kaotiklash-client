import StateMessage from "../Messages/StateMessage.js";

export default class ShieldOfYheAncestralOakEffect {
  static applyCounterAttack(target, stateMessages) {
    let isActive;

    if (!isActive) {
      const counterDamage = 20;

      let targetHP = target.getCurrentHP() - counterDamage;
      if (targetHP < 0) targetHP = 0;
      target.setCurrentHP(targetHP);

      const message = new StateMessage(
        "COUNTERATTACK: SHIELD OF THE ANCESTRAL OAK!",
        "40px MedievalSharp",
        "green",
        2,
        1200,
        520
      );
      const damageMessage = new StateMessage(
        `-${counterDamage} HP`,
        "30px MedievalSharp",
        "darkgreen",
        2,
        1200,
        570
      );

      stateMessages.push(message, damageMessage);

      isActive = true;
    }
  }
}
