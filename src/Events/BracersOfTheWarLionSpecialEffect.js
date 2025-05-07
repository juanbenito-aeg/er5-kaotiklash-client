import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class BracersOfTheWarLionSpecialEffect {
  static activeBoost(damage, target, stateMessage) {
    let isActive;
    if (!isActive) {
      const newDamage = damage + 15;

      const msg = new StateMessage(
        "WAR LION'S FURY! +15 DMG",
        "30px MedievalSharp",
        "orange",
        1,
        2,
        target.getXCoordinate(),
        target.getYCoordinate() - 40,
        1,
        new Physics(0, 0, 0, 0, 0, 0, 0)
      );

      msg.getPhysics().vy = 20;

      stateMessage.push(msg);
      isActive = true;
      return newDamage;
    }
  }
}
