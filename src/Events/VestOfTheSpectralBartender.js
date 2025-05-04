import StateMessage from "../Messages/StateMessage.js";
import { AnimationTypeID } from "../Game/constants.js";

export default class VestOfTheSpectralBartenderEffect {
  static blockCrit(damage, target, stateMessage) {

    const msg = new StateMessage(
      "CRITICAL HIT BLOCKED!",
      "30px MedievalSharp",
      "orange",
      2,
      target.getXCoordinate() + 55,
      target.getYCoordinate() - 20,
      AnimationTypeID.PARRY
    );
    stateMessage.push(msg);

    return damage;
  }
}
