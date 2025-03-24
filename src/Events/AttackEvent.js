import Event from "./Event.js";

export default class AttackEvent extends Event {
  #attacker;
  #target;

  static create(attacker, target) {
    const attackEvent = new AttackEvent();
    attackEvent.#attacker = attacker;
    attackEvent.#target = target;
  }

  execute() {
    let damageToInflict;

    if (!this.#attacker.getWeapon()) {
      // ATTACK USING FISTS
      damageToInflict = this.#attacker.getAttack() - this.#target.getDefense();
    } else {
      // ATTACK USING A WEAPON (FOR NOW ONLY MELEE OR MISSILE)
      damageToInflict =
        this.#attacker.getAttack() +
        this.#attacker.getWeaponDamage() -
        this.#target.getDefense();
    }

    let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;
    if (targetNewCurrentHP < 0) {
      targetNewCurrentHP = 0;
    }

    this.#target.setCurrentHP(targetNewCurrentHP);
  }
}
