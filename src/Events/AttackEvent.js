import Event from "./Event.js";
import { WeaponType, CardState, BattlefieldArea } from "../Game/constants.js";
import DamageMessages from "../Messages/DamageMessage.js";
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
    let wasTheAttackPerformed = false;

    const attackerBox = this.#getBoxOfNMinion(
      this.#currentPlayerMovementGrid,
      this.#attacker
    );
    const targetBox = this.#getBoxOfNMinion(
      this.#enemyMovementGrid,
      this.#target
    );

    let damageToInflict;

    if (
      (!this.#attacker.getWeapon() ||
        this.#attacker.getMinionWeaponType() === WeaponType.MELEE) &&
      attackerBox.getBattlefieldAreaItBelongsTo() === BattlefieldArea.FRONT &&
      targetBox.getBattlefieldAreaItBelongsTo() === BattlefieldArea.FRONT
    ) {
      // THE (MELEE) ATTACK CAN BE PERFORMED AS BOTH MINIONS ARE POSITIONED IN THEIR MOVEMENT GRID'S FRONT AREA
      if (!this.#attacker.getWeapon()) {
        // ATTACK USING FISTS
        damageToInflict =
          this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();

        console.log(`Attacker damage ${this.#attacker.getCurrentAttack()}`);
        console.log(`Target defense ${this.#target.getCurrentDefense()}`);
      } else {
        // ATTACK USING A MELEE WEAPON
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();
      }
    } else {
      // THE ATTACK CANNOT BE PERFORMED, SO THE TARGET IS DESELECTED
      this.#target.setState(CardState.PLACED);

      return wasTheAttackPerformed;
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }

    let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;
    if (targetNewCurrentHP < 0) {
      targetNewCurrentHP = 0;
    }

    console.log(`Total damage ${damageToInflict}`);

    if (damageToInflict > 0) {
      damageToInflict = damageToInflict * -1;
    }

    const DamageMessage = new DamageMessages(
      damageToInflict,
      4,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() + 55
    );
    globals.damageMessages.push(DamageMessage);
  }
}
