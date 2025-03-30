import Event from "./Event.js";
import { globals } from "../index.js";
import { PhaseType } from "../Game/constants.js";

export default class EquipWeaponEvent extends Event {
  #weapon;
  #minionToEquipWeaponOn;

  constructor(weapon, minionToEquipWeaponOn) {
    super();

    this.#weapon = weapon;
    this.#minionToEquipWeaponOn = minionToEquipWeaponOn;
  }

  static create(weapon, minionToEquipWeaponOn) {
    const equipWeaponEvent = new EquipWeaponEvent(
      weapon,
      minionToEquipWeaponOn
    );
    return equipWeaponEvent;
  }

  execute() {

    this.#minionToEquipWeaponOn.setWeapon(this.#weapon);
    console.log(this.#minionToEquipWeaponOn);
    this.#minionToEquipWeaponOn = null
  }
}
