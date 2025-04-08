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

    let roll = Math.floor(Math.random() * 100 + 1);
    let critProb = this.#attacker.getCritChance();
    let fumbreProb = this.#attacker.getFumbleChance();
    let chances = critProb + fumbreProb;
    let fumble = false;
    let targetWeapon = this.#target.getWeapon();
    let attackerWeapon = this.#attacker.getWeapon();

    if (roll > critProb && roll <= chances) { // FUMBLE

      console.log("Fumble");
      fumble = true;
    }
    
    if(fumble) {
      this.#target = this.#attacker;
    }


    if (!attackerWeapon && this.#parry === false) {                                             // ATTACK USING FISTS && ENEMY IS NOT PARRYING
      if(fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() - (this.#target.getCurrentDefense()/2);
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() - this.#target.getCurrentDefense();
      }

      damageToInflict = Math.floor(damageToInflict)

      damageToInflict = Math.floor(damageToInflict)
    } else if (!attackerWeapon && this.#parry === true) {                                       // ATTACK USING FISTS && ENEMY IS PARRYING
        damageToInflict =
        this.#attacker.getCurrentAttack()

        damageToInflict = Math.floor(damageToInflict)

    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE && this.#parry === false) {    // ATTACK USING A MELEE WEAPON && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          (this.#target.getCurrentDefense()/2);

      } else {      
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();

      }

      damageToInflict = Math.floor(damageToInflict)
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE && this.#parry === true) {     // ATTACK USING A MELEE WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        (this.#target.getCurrentDefense()/2);

        damageToInflict = Math.floor(damageToInflict)
      } else {
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage()
      }

      damageToInflict = Math.floor(damageToInflict)
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE && this.#parry === false) {  // ATTACK USING A MISSILE WEAPON && ENEMY IS NOT PARRYING
      if (fumble) {
        damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        (this.#target.getCurrentDefense()/2);

        damageToInflict = Math.floor(damageToInflict)
      }
      else {  
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        this.#target.getCurrentDefense();
      damageToInflict = Math.floor(this.caltulateDistance(damageToInflict))
      }
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE && this.#parry === true) {   // ATTACK USING A MISSILE WEAPON && ENEMY IS PARRYING
    if (fumble) {
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        (this.#target.getCurrentDefense()/2);

      damageToInflict = Math.floor(damageToInflict)
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();
          
          damageToInflict = Math.floor(this.caltulateDistance(damageToInflict))
        }
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID && this.#parry === false) {   // ATTACK USING A HYBRID WEAPON && ENEMY IS NOT PARRYING
      if(fumble) {  
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          (this.#target.getCurrentDefense()/2);

          damageToInflict = Math.floor(damageToInflict)
      }
      else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage() -
          this.#target.getCurrentDefense();
        
          damageToInflict = Math.floor(this.caltulateDistance(damageToInflict))
        }
    } else if (this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID && this.#parry === true) {    // ATTACK USING A HYBRID WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage() -
        (this.#target.getCurrentDefense()/2);

        damageToInflict = Math.floor(damageToInflict)
      } else {
      damageToInflict =
        this.#attacker.getCurrentAttack() +
        this.#attacker.getWeaponCurrentDamage()

        damageToInflict = Math.floor(this.caltulateDistance(damageToInflict))
      }
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }
    if(attackerWeapon) {
      let attackerNewDurability = attackerWeapon.getCurrentDurability() - damageToInflict;
      if (attackerNewDurability < 0) {
        attackerNewDurability = 0;
      }
      attackerWeapon.setCurrentDurability(attackerNewDurability);

      if (attackerWeapon.getCurrentDurability() <= 0) {
        this.#attacker.removeWeapon();
      }
    }



    if (roll <= critProb) { // CRITICAL HIT
      console.log("Critical Hit");
      damageToInflict = damageToInflict * 1.75;
      damageToInflict = Math.floor(damageToInflict)
    } 



    if(this.#parry === true && !fumble) {  // PARRY
      
      if(targetWeapon.getCurrentDurability() >= damageToInflict) {
      if(parryFumble) {             // PARRY FUMBLE
        damageToInflict = targetWeapon.getCurrentDurability();
      } else if (parryHalfFumble) { // PARRY HALF FUMBLE
        damageToInflict = damageToInflict * 1.25;
        damageToInflict = Math.floor(damageToInflict)
      } else if(parryCrit) {        // PARRY CRIT 
        damageToInflict = 0;
      }
    } else { //NO DURABILITY PARRY
      if(noDurabilityRoll === 1 && noDurabilityRoll === 2) {        //NO DURABILITY CRIT
        damageToInflict = targetWeapon.getCurrentDurability();
      } else if(noDurabilityRoll === 3) { //NO DURABILITY FUMBLE
        storedDamage = damageToInflict
        damageToInflict = targetWeapon.getCurrentDurability();
      } 
      
    }
      let targetNewDurability = targetWeapon.getCurrentDurability() - damageToInflict;
      if (targetNewDurability < 0) {
        storedDamage = Math.abs(targetNewDurability);
        targetNewDurability = 0;
      }
      targetWeapon.setCurrentDurability(targetNewDurability);

      if (targetWeapon.getCurrentDurability() <= 0) {
        this.#target.removeWeapon();
      }
    } else {
      let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;
      if (targetNewCurrentHP < 0) {
        targetNewCurrentHP = 0;
      }
      this.#target.setCurrentHP(targetNewCurrentHP);
    }
    let targetNewCurrentHP = this.#target.getCurrentHP() - storedDamage;
    if (targetNewCurrentHP < 0) {
      targetNewCurrentHP = 0;
    }
    this.#target.setCurrentHP(targetNewCurrentHP);
  
    if (damageToInflict > 0) {
      damageToInflict = damageToInflict * -1;
    }

    let targetBox;
    if(fumble) {
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
