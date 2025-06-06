import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class ShieldOfYheAncestralOakEffect {
  static applyCounterAttack(target, stateMessages) {
    let isActive = false;

    if (!isActive) {
      const counterDamage = 20;

      let targetHP = target.getCurrentHP() - counterDamage;
      if (targetHP < 0) targetHP = 0;
      target.setCurrentHP(targetHP);

      const message = new StateMessage(
        "COUNTERATTACK: SHIELD OF THE ANCESTRAL OAK!",
        "30px MedievalSharp",
        "purple",
        1,
        2,
        1200,
        520,
        1,
        new Physics(0, 0)
      );
      const damageMessage = new StateMessage(
        `-${counterDamage} HP`,
        "30px MedievalSharp",
        "darkred",
        1,
        2,
        1200,
        570,
        1,
        new Physics(0, 0)
      );

      message.setVY(20);

      damageMessage.setVY(20);

      stateMessages.push(message, damageMessage);

      isActive = true;
    }
  }
}
