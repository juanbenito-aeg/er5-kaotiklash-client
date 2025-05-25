import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class ArmorOfTitanicFuryEffect {
  static activeBoost(target, stateMessages) {
    const plus10AttackMsg = new StateMessage(
      "+10 ATK",
      "30px MedievalSharp",
      "rgb(240 167 163)",
      1,
      2,
      target.getXCoordinate() + 55,
      target.getYCoordinate(),
      1,
      new Physics(0, 0)
    );
    plus10AttackMsg.setVY(20);

    stateMessages.push(plus10AttackMsg);

    target.setCurrentAttack(target.getCurrentAttack() + 10);
  }

  static resetBoost(target, stateMessages) {
    const attackBoostToRemove =
      target.getCurrentAttack() - target.getInitialAttack();
    const removedAttackBoostMsg = new StateMessage(
      `-${attackBoostToRemove} ATK`,
      "30px MedievalSharp",
      "rgb(240 167 163)",
      1,
      2,
      target.getXCoordinate() + 55,
      target.getYCoordinate(),
      1,
      new Physics(0, 0)
    );

    removedAttackBoostMsg.setVY(20);

    stateMessages.push(removedAttackBoostMsg);

    target.setCurrentAttack(target.getInitialAttack());
  }
}
