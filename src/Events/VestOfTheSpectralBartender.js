import StateMessage from "../Messages/StateMessage.js";
import Physics from "../Game/Physics.js";

export default class VestOfTheSpectralBartenderEffect {
  static blockCrit(damage, target, stateMessage) {
    const msg = new StateMessage(
      "EXTRA DAMAGE OF THE CRITICAL HIT IGNORED!",
      "30px MedievalSharp",
      "orange",
      1,
      2,
      target.getXCoordinate() + 55,
      target.getYCoordinate() - 20,
      1,
      new Physics(0, 0, 0, 0, 0, 0, 0)
    );
    stateMessage.push(msg);

    return damage;
  }
}
