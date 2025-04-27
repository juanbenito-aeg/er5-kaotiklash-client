import StateMessage from "../Messages/StateMessage.js";

export default class ArmorOfTitanicFuryEffect {
  static activeBoost(target, stateMessage) {

    const msg = new StateMessage(
      "💢",
      "30px MedievalSharp",
      "",
      2,
      target.getXCoordinate() - 10,
      target.getYCoordinate() + 55
    );
    stateMessage.push(msg);
    target.setCurrentAttack(target.getCurrentAttack() + 10);
  }

  static resetBoost(target) {
    target.setCurrentAttack(target.getInitialAttack());

  }
}
