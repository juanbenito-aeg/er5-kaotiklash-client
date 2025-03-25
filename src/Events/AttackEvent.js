import Event from "./Event.js";

export default class AttackEvent extends Event {
  #attacker;
  #target;

  static create(attacker, target) {
    const attackEvent = new AttackEvent();
    attackEvent.#attacker = attacker;
    attackEvent.#target = target;

    return attackEvent;
  }

  execute() {
    let damageToInflict;

    if (/* !this.#attacker.getWeapon() */ true) {
      // ATTACK USING FISTS
      damageToInflict =
        this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();
    } else {
      // ATTACK USING A WEAPON (FOR NOW ONLY MELEE OR MISSILE)
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponDamage() -
        this.#target.getCurrentDefense();
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }

    let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;
    if (targetNewCurrentHP < 0) {
      targetNewCurrentHP = 0;
    }

    this.#target.setCurrentHP(targetNewCurrentHP);
  }
}
