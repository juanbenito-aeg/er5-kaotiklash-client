import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class ArmorOfTitanicFuryEffect {
  static activeBoost(target, stateMessage) {

    const physics = new Physics(0,0,0,0,0,0,0);
    const msg = new StateMessage(
      "💢",
      "30px MedievalSharp",
      "",
      1,
      2,
      target.getXCoordinate() - 10,
      target.getYCoordinate() + 55,
      1,
      physics
    );
    stateMessage.push(msg);
    target.setCurrentAttack(target.getCurrentAttack() + 10);
  }

  static resetBoost(target) {
    target.setCurrentAttack(target.getInitialAttack());

  }
}
