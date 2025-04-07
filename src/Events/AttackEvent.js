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

  constructor(
    attacker,
    target,
    currentPlayerMovementGrid,
    enemyMovementGrid,
    parry
  ) {
    super();

    this.#attacker = attacker;
    this.#target = target;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    this.#enemyMovementGrid = enemyMovementGrid;
    this.#parry = parry;
  }

  static create(
    attacker,
    target,
    currentPlayerMovementGrid,
    enemyMovementGrid,
    parry
  ) {
    const attackEvent = new AttackEvent(
      attacker,
      target,
      currentPlayerMovementGrid,
      enemyMovementGrid,
      parry
    );

    return attackEvent;
  }

  execute() {
    let damageToInflict;
    let critProb = this.#attacker.getCritChance();
    let fumbreProb = this.#attacker.getFumbleChance();
    let roll = Math.floor(Math.random() * 100 + 1);
    let chances = critProb + fumbreProb;
    let fumble = false;
    if (roll > critProb && roll <= chances) {
      // FUMBLE
      console.log("Fumble");
      fumble = true;
    }
    if (fumble) {
      this.#target = this.#attacker;
    }

    if (!this.#attacker.getWeapon() && this.#parry === false) {
      // ATTACK USING FISTS && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() -
          this.#target.getCurrentDefense() / 2;
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();
      }
    } else if (!this.#attacker.getWeapon() && this.#parry === true) {
      // ATTACK USING FISTS && ENEMY IS PARRYING
      damageToInflict = this.#attacker.getCurrentAttack();
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE &&
      this.#parry === false
    ) {
      // ATTACK USING A MELEE WEAPON && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE &&
      this.#parry === true
    ) {
      // ATTACK USING A MELEE WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE &&
      this.#parry === false
    ) {
      // ATTACK USING A MISSILE WEAPON && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();
        damageToInflict = Math.floor(this.caltulateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE &&
      this.#parry === true
    ) {
      // ATTACK USING A MISSILE WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(this.caltulateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID &&
      this.#parry === false
    ) {
      // ATTACK USING A HYBRID WEAPON && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;

        damageToInflict = Math.floor(damageToInflict);
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();

        damageToInflict = Math.floor(this.caltulateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID &&
      this.#parry === true
    ) {
      // ATTACK USING A HYBRID WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense() / 2;

        damageToInflict = Math.floor(damageToInflict);
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(this.caltulateDistance(damageToInflict));
      }
    }

    if (roll <= critProb) {
      // CRITICAL HIT
      console.log("Critical Hit");
      damageToInflict = damageToInflict * 1.75;
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }

    if (this.#parry === true) {
      let targetNewDurability =
        damageToInflict - this.#target.getWeapon().getCurrentDurability();

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

    let targetBox;
    if (fumble) {
      targetBox = this.#target.getBoxIsPositionedIn(
        this.#currentPlayerMovementGrid,
        this.#target
      );
    } else {
      targetBox = this.#target.getBoxIsPositionedIn(
        this.#enemyMovementGrid,
        this.#target
      );
    }

    const DamageMessage = new DamageMessages(
      damageToInflict,
      4,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() + 55
    );
    globals.damageMessages.push(DamageMessage);
  }

  caltulateDistance(damageToInflict) {
    // Calculate the distance between the attacker and target
    let x1 = this.#attacker.getXCoordinate();
    let y1 = this.#attacker.getYCoordinate();
    let x2 = this.#target.getXCoordinate();
    let y2 = this.#target.getYCoordinate();
    let xDiff = Math.abs(x2 - x1) / 135;
    let yDiff = Math.abs(y2 - y1) / 135;
    let distance = xDiff + yDiff;

    let newdamageToInflict = damageToInflict / distance;

    return newdamageToInflict;
  }
}
