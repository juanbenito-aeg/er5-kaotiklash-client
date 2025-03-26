import Event from "./Event.js";

export default class EquipWeaponEvent extends Event {
  #weapon;
  #minionToEquipWeaponOn;

  constructor(weapon, minionToEquipWeaponOn) {
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
  }
}
