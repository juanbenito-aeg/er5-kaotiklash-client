import StateMessage from "../Messages/StateMessage.js";
import { AnimationTypeID } from "../Game/constants.js";

export default class BracersOfTheWarLionSpecialEffect {
  static activeBoost(damage, target, stateMessage) {
    let isActive;
    if (!isActive) {
      const newDamage = damage + 15;

      const msg = new StateMessage(
        "WAR LION'S FURY! +15 DMG",
        "30px MedievalSharp",
        "orange",
        2,
        target.getXCoordinate(),
        target.getYCoordinate() - 40,
        AnimationTypeID.BOOST
      );
      stateMessage.push(msg);
      isActive = true;
      return newDamage;
    }
  }
}
