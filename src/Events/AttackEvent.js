import Event from "./Event.js";
import DamageMessages from "../Messages/DamageMessage.js";
import { WeaponTypeID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class AttackEvent extends Event {
  #attacker;
  #target;
  #currentPlayerMovementGrid;
  #enemyMovementGrid;

  static create(
    attacker,
    target,
    currentPlayerMovementGrid,
    enemyMovementGrid
  ) {
    const attackEvent = new AttackEvent();
    attackEvent.#attacker = attacker;
    attackEvent.#target = target;
    attackEvent.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    attackEvent.#enemyMovementGrid = enemyMovementGrid;

    return attackEvent;
  }

  execute() {
    let damageToInflict;

    if (!this.#attacker.getWeapon()) {
      // ATTACK USING FISTS
      damageToInflict =
        this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE) {
      // ATTACK USING A MELEE WEAPON
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
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

    if (damageToInflict > 0) {
      damageToInflict = damageToInflict * -1;
    }

    const targetBox = this.#target.getBoxIsPositionedIn(
      this.#enemyMovementGrid,
      this.#target
    );

    const DamageMessage = new DamageMessages(
      damageToInflict,
      4,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() + 55
    );
    globals.damageMessages.push(DamageMessage);
  }
}
