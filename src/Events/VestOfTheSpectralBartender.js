import StateMessage from "../Messages/StateMessage.js";

export default class VestOfTheSpectralBartenderEffect {
  static blockCrit(damage, target, stateMessage) {
    const msg = new StateMessage(
      "EXTRA DAMAGE OF THE CRITICAL HIT IGNORED!",
      "30px MedievalSharp",
      "orange",
      2,
      target.getXCoordinate() + 55,
      target.getYCoordinate() - 20
    );
    stateMessage.push(msg);

    return damage;
  }
}
