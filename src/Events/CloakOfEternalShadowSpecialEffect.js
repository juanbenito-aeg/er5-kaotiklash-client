import { MinionTypeID, WeaponTypeID } from "../Game/constants.js";

export default class CloakOfEternalShadowSpecialEffect {
  static canDodge(target, isArmorPowerChosen, weaponType) {
    const isWizard = target.getMinionTypeID() === MinionTypeID.WIZARD;
    const isMeleeAttack = weaponType === WeaponTypeID.MELEE;

    return isWizard && isArmorPowerChosen && isMeleeAttack;
  }
}
