import Event from "./Event.js";
import DamageMessages from "../Messages/DamageMessage.js";
import { WeaponTypeID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class AttackEvent extends Event {
  #attacker;
  #target;
  #currentPlayerMovementGrid;
  #enemyMovementGrid;
  #parry;

  static create(
    attacker,
    target,
    currentPlayerMovementGrid,
    enemyMovementGrid,
    parry
  ) {
    const attackEvent = new AttackEvent();
    attackEvent.#attacker = attacker;
    attackEvent.#target = target;
    attackEvent.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    attackEvent.#enemyMovementGrid = enemyMovementGrid;
    attackEvent.#parry = parry;

    return attackEvent;
  }

  execute() {
    let damageToInflict      

    if (!this.#attacker.getWeapon() && this.#parry === false) {
      // ATTACK USING FISTS && ENEMY IS NOT PARRYING

      damageToInflict =
        this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();
    } else if (!this.#attacker.getWeapon() && this.#parry === true) {
      // ATTACK USING FISTS && ENEMY IS PARRYING
      
        damageToInflict =
        this.#attacker.getCurrentAttack()
        console.log("damageToInflict", damageToInflict);
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE && this.#parry === false) {
      // ATTACK USING A MELEE WEAPON && ENEMY IS NOT PARRYING
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        this.#target.getCurrentDefense();
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE && this.#parry === true) {
      // ATTACK USING A MELEE WEAPON && ENEMY IS PARRYING
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage()
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }

    if(this.#parry === true) {
      let targetNewDurability = damageToInflict - this.#target.getWeapon().getCurrentDurability();

      // this.#target.getWeapon().setCurrentDurability(targetNewDurability);
      
    } else {
      let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;
      if (targetNewCurrentHP < 0) {
        targetNewCurrentHP = 0;
      }
      this.#target.setCurrentHP(targetNewCurrentHP);
    }
    
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
