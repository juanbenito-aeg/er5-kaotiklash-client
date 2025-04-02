import Event from "./Event.js";

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
    this.#minionToEquipWeaponOn = null;
  }
}
