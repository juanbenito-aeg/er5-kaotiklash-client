import Event from "./Event.js";
import { CardCategory } from "../Game/constants.js";

export default class EquipWeaponOrArmorEvent extends Event {
  #weaponOrArmor;
  #minionToEquipWeaponOrArmorOn;

  constructor(weaponOrArmor, minionToEquipWeaponOrArmorOn) {
    super();

    this.#weaponOrArmor = weaponOrArmor;
    this.#minionToEquipWeaponOrArmorOn = minionToEquipWeaponOrArmorOn;
  }

  execute() {
    if (this.#weaponOrArmor.getCategory() === CardCategory.WEAPON) {
      this.#minionToEquipWeaponOrArmorOn.setWeapon(this.#weaponOrArmor);
    } else {
      this.#minionToEquipWeaponOrArmorOn.setArmor(this.#weaponOrArmor);
    }
  }
}
