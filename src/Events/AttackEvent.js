import Event from "./Event.js";
import StateMessage from "../Messages/StateMessage.js";
import CloakOfEternalShadowSpecialEffect from "./CloakOfEternalShadowSpecialEffect.js";
import ShieldOfTheAncestralOakEffect from "./ShieldOfTheAncestralOakEffect.js";
import BracersOfTheWarLionSpecialEffect from "./BracersOfTheWarLionSpecialEffect.js";
import VestOfTheSpectralBartenderEffect from "./VestOfTheSpectralBartender.js";
import ArmorOfTitanicFuryEffect from "./ArmorOfTitanicFury.js";
import globals from "../Game/globals.js";
import {
  ArmorID,
  PlayerID,
  WeaponTypeID,
  MinionTypeID,
  Sound,
} from "../Game/constants.js";
import Physics from "../Game/Physics.js";

export default class AttackEvent extends Event {
  #attacker;
  #target;
  #currentPlayerMovementGrid;
  #enemyMovementGrid;
  #parry;
  #isArmorPowerChosen;
  #eventDeck;
  #stateMessages;
  #player;
  #eventsData;
  #stats;
  #blinkingAnimation;

  constructor(
    attacker,
    target,
    currentPlayerMovementGrid,
    enemyMovementGrid,
    parry,
    isArmorPowerChosen,
    eventDeck,
    stateMessages,
    player,
    eventsData,
    stats,
    blinkingAnimation
  ) {
    super();

    this.#attacker = attacker;
    this.#target = target;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    this.#enemyMovementGrid = enemyMovementGrid;
    this.#parry = parry;
    this.#isArmorPowerChosen = isArmorPowerChosen;
    this.#eventDeck = eventDeck;
    this.#stateMessages = stateMessages;
    this.#player = player;
    this.#eventsData = eventsData;
    this.#stats = stats;
    this.#blinkingAnimation = blinkingAnimation;
  }

  execute() {
    if (
      this.#isArmorPowerChosen &&
      this.#target.getArmorID() === ArmorID.CLOAK_ETERNAL_SHADOW
    ) {
      this.#handleCloakPower();
      return;
    }

    if (
      this.#eventsData.shieldOfBalanceActive &&
      this.#player.getID() !== this.#eventsData.shieldOfBalanceOwner
    ) {
      let targetBox = this.#target.getBoxIsPositionedIn(
        this.#enemyMovementGrid,
        this.#target
      );

      let nullifiedMessage = new StateMessage(
        "ATTACK NULLIFIED BY SHIELD OF BALANCE!",
        "50px MedievalSharp",
        "red",
        1,
        2,
        targetBox.getCard().getXCoordinate() +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2,
        targetBox.getCard().getYCoordinate() +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height /
            2,
        1,
        new Physics(0, 0)
      );

      nullifiedMessage.setVY(20);

      this.#stateMessages.push(nullifiedMessage);

      return;
    }

    const targetHasBreastplatePrimordialColossus =
      this.#isArmorPowerChosen &&
      this.#target.getArmorID() === ArmorID.BREASTPLATE_PRIMORDIAL_COLOSSUS;

    let breastplatePrimordialColossusOwner;
    if (targetHasBreastplatePrimordialColossus) {
      breastplatePrimordialColossusOwner = this.#target;
    }

    let damageToInflict;

    let roll = Math.floor(Math.random() * 100 + 1);
    let critProb = this.#attacker.getCritChance();
    let fumbreProb = this.#attacker.getFumbleChance();
    let chances = critProb + fumbreProb;
    let fumble = false;

    if (
      !targetHasBreastplatePrimordialColossus &&
      roll > critProb &&
      roll <= chances
    ) {
      // FUMBLE
      this.#stats.incrementPlayerXFumbles(this.#player.getID());
      console.log("Fumble");
      fumble = true;
    }

    if (fumble) {
      this.#blinkingAnimation.card = this.#attacker;
      this.#blinkingAnimation.time = 0;
    } else {
      this.#blinkingAnimation.card = this.#target;
      this.#blinkingAnimation.time = 0;
    }
    if (targetHasBreastplatePrimordialColossus || fumble) {
      this.#target = this.#attacker;
    }

    let attackerWeapon = this.#attacker.getWeapon();
    let targetWeapon = this.#target.getWeapon();
    let targetArmor = this.#target.getArmor();

    let isPlayer1Debuffed = false;
    let isPlayer2Debuffed = false;
    let debuff = 10;

    if (this.#eventsData.curseOfTheBoundTitan.isActive === true) {
      if (
        this.#player.getID() === PlayerID.PLAYER_1 &&
        this.#eventsData.curseOfTheBoundTitan.isPlayer1Affected
      ) {
        isPlayer1Debuffed = true;
      }
      if (
        this.#player.getID() === PlayerID.PLAYER_2 &&
        this.#eventsData.curseOfTheBoundTitan.isPlayer2Affected
      ) {
        isPlayer2Debuffed = true;
      }
    }

    if (!attackerWeapon) {
      // ATTACK USING FISTS

      globals.currentSound = Sound.PUNCH;

      if (this.#parry) {
        // ENEMY IS PARRYING
        damageToInflict = this.#attacker.getCurrentAttack();
      } else {
        // ENEMY IS NOT PARRYING
        if (fumble) {
          damageToInflict =
            this.#attacker.getCurrentAttack() -
            this.#target.getCurrentDefense() / 2;
        } else {
          damageToInflict =
            this.#attacker.getCurrentAttack() -
            this.#target.getCurrentDefense();
        }
      }

      damageToInflict = Math.floor(damageToInflict);
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE &&
      this.#parry === false
    ) {
      globals.currentSound = Sound.MELEE;
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

      damageToInflict = Math.floor(damageToInflict);
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE &&
      this.#parry === true
    ) {
      globals.currentSound = Sound.MELEE;
      // ATTACK USING A MELEE WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();
      }

      damageToInflict = Math.floor(damageToInflict);
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE &&
      this.#parry === false
    ) {
      globals.currentSound = Sound.MISSILE_HYBRID;
      // ATTACK USING A MISSILE WEAPON && ENEMY IS NOT PARRYING
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
        damageToInflict = Math.floor(this.calculateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE &&
      this.#parry === true
    ) {
      globals.currentSound = Sound.MISSILE_HYBRID;

      // ATTACK USING A MISSILE WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(damageToInflict);
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(this.calculateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID &&
      this.#parry === false
    ) {
      globals.currentSound = Sound.MISSILE_HYBRID;
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

        damageToInflict = Math.floor(this.calculateDistance(damageToInflict));
      }
    } else if (
      this.#attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID &&
      this.#parry === true
    ) {
      globals.currentSound = Sound.MISSILE_HYBRID;
      // ATTACK USING A HYBRID WEAPON && ENEMY IS PARRYING
      if (fumble) {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(damageToInflict);
      } else {
        damageToInflict =
          this.#attacker.getCurrentAttack() +
          this.#attacker.getWeaponCurrentDamage();

        damageToInflict = Math.floor(this.calculateDistance(damageToInflict));
      }
    }

    if (targetArmor) {
      if (
        this.#target.getArmorID() === ArmorID.ARMOR_OF_TITANIC_FURY &&
        this.#target.getMinionTypeID() === MinionTypeID.WARRIOR
      ) {
        ArmorOfTitanicFuryEffect.activeBoost(this.#target, this.#stateMessages);
      }
    }

    let targetBox;
    if (targetHasBreastplatePrimordialColossus || fumble) {
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

    if (isPlayer1Debuffed && this.#player.getID() === PlayerID.PLAYER_1) {
      damageToInflict = damageToInflict - debuff;
    }
    if (isPlayer2Debuffed && this.#player.getID() === PlayerID.PLAYER_2) {
      damageToInflict = damageToInflict - debuff;
    }

    if (damageToInflict < 0) {
      damageToInflict = 0;
    }

    if (attackerWeapon) {
      let attackerNewDurability =
        attackerWeapon.getCurrentDurability() - damageToInflict;
      if (attackerNewDurability < 0) {
        attackerNewDurability = 0;
      }
      attackerWeapon.setCurrentDurability(attackerNewDurability);
      let attackerBox = this.#attacker.getBoxIsPositionedIn(
        this.#currentPlayerMovementGrid,
        this.#attacker
      );
      if (attackerWeapon.getCurrentDurability() <= 0) {
        this.weaponMessage(attackerBox);
        this.#attacker.resetWeaponAttributes();
        this.#eventDeck.insertCard(this.#attacker.getWeapon());
        this.#attacker.removeWeapon();
      }
    }

    let parryRoll = Math.floor(Math.random() * 100 + 1);
    let parryCritProb = this.#target.getParryCritChance();
    let parryFumbleProb = this.#target.getParryFumbleChance();
    let parryHalfFumbleProb = this.#target.getHalfParryFumbleChance();
    let parryFumbleChances = parryCritProb + parryFumbleProb;
    let parryHalfFumbleChances = parryFumbleChances + parryHalfFumbleProb;
    let parryCrit = false;
    let parryFumble = false;
    let parryHalfFumble = false;

    let noDurabilityRoll = Math.floor(Math.random() * 10 + 1);

    let storedDamage = 0;

    if (this.#parry) {
      console.log("Parry");
      if (parryRoll <= parryCritProb) {
        // PARRY CRIT
        console.log("Parry Crit");
        parryCrit = true;
      } else if (parryRoll > parryCritProb && parryRoll <= parryFumbleChances) {
        // PARRY FUMBLE
        console.log("Parry Fumble");
        parryFumble = true;
      } else if (
        parryRoll > parryFumbleChances &&
        parryRoll <= parryHalfFumbleChances
      ) {
        // PARRY HALF FUMBLE
        console.log("Parry Half Fumble");
        parryHalfFumble = true;
      }
    }

    let crit = false;
    if (roll <= critProb) {
      // CRITICAL HIT
      this.#stats.incrementPlayerXCriticalHits(this.#player.getID());
      crit = true;
      console.log("Critical Hit");
      let baseDamage = damageToInflict;
      damageToInflict = damageToInflict * 1.75;
      damageToInflict = Math.floor(damageToInflict);
      if (
        this.#target.getArmor() &&
        this.#target.getArmor().getID() ===
          ArmorID.VEST_OF_THE_SPECTRAL_BARTENDER &&
        this.#target.getMinionTypeID() === MinionTypeID.WIZARD
      ) {
        damageToInflict = VestOfTheSpectralBartenderEffect.blockCrit(
          baseDamage,
          this.#target,
          this.#stateMessages
        );
        crit = false;
      }
    }

    if (this.#parry === true && !fumble && this.#target.getWeapon()) {
      // PARRY
      if (
        this.#target.getArmor() &&
        this.#target.getArmor().getID() ===
          ArmorID.SHIELD_OF_THE_ANCESTRAL_OAK &&
        this.#target.getMinionTypeID() === MinionTypeID.WARRIOR
      ) {
        ShieldOfTheAncestralOakEffect.applyCounterAttack(
          this.#attacker,
          this.#stateMessages
        );
      }

      if (
        this.#attacker.getArmor() &&
        this.#attacker.getArmor().getID() === ArmorID.BRACERS_OF_THE_WAR_LION &&
        this.#attacker.getMinionTypeID() === MinionTypeID.WIZARD
      ) {
        damageToInflict = BracersOfTheWarLionSpecialEffect.activeBoost(
          damageToInflict,
          this.#target,
          this.#stateMessages
        );
      }

      if (targetWeapon.getCurrentDurability() >= damageToInflict) {
        if (parryFumble) {
          // PARRY FUMBLE
          damageToInflict = targetWeapon.getCurrentDurability();
          this.parryFumbleMessage(damageToInflict, targetBox);
        } else if (parryHalfFumble) {
          // PARRY HALF FUMBLE
          damageToInflict = damageToInflict * 1.25;
          damageToInflict = Math.floor(damageToInflict);
          this.parryHalfFumbleMessage(damageToInflict, targetBox);
        } else if (parryCrit) {
          // PARRY CRIT
          damageToInflict = 0;
          this.parryCritMessage(damageToInflict, targetBox);
        } else {
          this.parryMessage(damageToInflict, targetBox);
        }
      } else {
        //NO DURABILITY PARRY
        if (noDurabilityRoll === 1 && noDurabilityRoll === 2) {
          //NO DURABILITY CRIT
          damageToInflict = targetWeapon.getCurrentDurability();
          this.parryCritMessage(damageToInflict, targetBox);
        } else if (noDurabilityRoll === 3) {
          //NO DURABILITY FUMBLE
          storedDamage = damageToInflict;
          damageToInflict = targetWeapon.getCurrentDurability();
          this.parryFumbleMessage(damageToInflict, targetBox);
          this.damageMessage(storedDamage, targetBox, "red");
        } else {
          let NewDurability =
            targetWeapon.getCurrentDurability() - damageToInflict;

          this.parryMessage(
            targetWeapon.getCurrentDurability() - NewDurability,
            targetBox
          );
        }
      }
      let targetNewDurability =
        targetWeapon.getCurrentDurability() - damageToInflict;
      if (targetNewDurability < 0) {
        storedDamage = Math.abs(targetNewDurability);
        targetNewDurability = 0;
        this.damageMessage(storedDamage, targetBox, "lightblue");
      }
      targetWeapon.setCurrentDurability(targetNewDurability);

      if (targetWeapon.getCurrentDurability() <= 0) {
        this.weaponMessage(targetBox);
        this.#target.resetWeaponAttributes();
        this.#eventDeck.insertCard(targetWeapon);
        this.#target.removeWeapon();

        if (targetArmor) {
          let armorNewDurability =
            targetArmor.getCurrentDurability() - storedDamage;
          if (armorNewDurability < 0) {
            this.#applyOverflowDamage(targetArmor, targetBox);
          }

          targetArmor.setCurrentDurability(armorNewDurability);

          if (targetArmor.getCurrentDurability() <= 0) {
            this.#createAndStoreArmorBrokeMsg(targetBox);
            this.#target.resetArmorAttributes();
            this.#eventDeck.insertCard(this.#target.getArmor());
            this.#target.removeArmor();
          }
        }
      }
    } else {
      if (targetArmor && damageToInflict > 0) {
        let armorNewDurability =
          targetArmor.getCurrentDurability() - damageToInflict;

        if (armorNewDurability < 0) {
          this.#applyOverflowDamage(targetArmor, targetBox);
        }

        targetArmor.setCurrentDurability(armorNewDurability);

        if (targetArmor.getCurrentDurability() <= 0) {
          this.#createAndStoreArmorBrokeMsg(targetBox);
          this.#target.resetArmorAttributes();
          this.#eventDeck.insertCard(this.#target.getArmor());
          this.#target.removeArmor();
        }

        damageToInflict = 0;
      }

      let targetNewCurrentHP = this.#target.getCurrentHP() - damageToInflict;

      if (targetNewCurrentHP < 0) {
        targetNewCurrentHP = 0;
        this.deathMessage(this.#target);
        this.#stats.incrementPlayerXMinionsKilled(this.#player.getID());
      }

      this.#target.setCurrentHP(targetNewCurrentHP);
    }

    let targetNewCurrentHPStored = this.#target.getCurrentHP() - storedDamage;
    if (targetNewCurrentHPStored < 0) {
      targetNewCurrentHPStored = 0;
      this.deathMessage(this.#target);
      this.#stats.incrementPlayerXMinionsKilled(this.#player.getID());
    }
    this.#target.setCurrentHP(targetNewCurrentHPStored);

    if (targetHasBreastplatePrimordialColossus) {
      // IF THE TARGET HAS THE "Breastplate of the Primordial Colossus" EQUIPPED & USED ITS POWER, RESET THE ARMOR'S ATTRIBUTES, INSERT IT INTO THE EVENTS DECK & REMOVE IT FROM ITS OWNER
      this.#finishBreastplatePrimordialColossusPower(
        breastplatePrimordialColossusOwner
      );
    }

    if (!attackerWeapon) {
      // RESET TITANIC FURY BOOST AFTER THE ATTACK IS FINISHED
      // TO FIX: IT ALLWAYS TRIGGERS
      //ArmorOfTitanicFuryEffect.resetBoost(this.#attacker, this.#stateMessages);
    }

    if (damageToInflict > 0) {
      damageToInflict = damageToInflict * -1;
    }

    if (fumble) {
      this.fumbleMessage(targetBox);
      this.damageMessage(damageToInflict, targetBox, "red");
    } else if (crit) {
      this.critMessage(targetBox);
      this.damageMessage(damageToInflict, targetBox, "gold");
    } else if (!this.#parry) {
      this.damageMessage(damageToInflict, targetBox, "red");
    }
  }

  calculateDistance(damageToInflict) {
    // Calculate the distance between the attacker and target
    let x1 = this.#attacker.getXCoordinate();
    let y1 = this.#attacker.getYCoordinate();
    let x2 = this.#target.getXCoordinate();
    let y2 = this.#target.getYCoordinate();
    let xDiff = Math.abs(x2 - x1) / 135;
    let yDiff = Math.abs(y2 - y1) / 135;
    let distance = xDiff + yDiff;

    distance = Math.max(1, distance);

    let newdamageToInflict = damageToInflict / distance;

    return newdamageToInflict;
  }

  parryMessage(damageToInflict, targetBox) {
    const parryMessage = new StateMessage(
      `WEAPON DURABILITY!: -${damageToInflict}`,
      "60px MedievalSharp",
      "lightblue",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    parryMessage.setVY(20);

    this.#stateMessages.push(parryMessage);
  }

  parryFumbleMessage(damageToInflict, targetBox) {
    const parryMessage = new StateMessage(
      `PARRY FAILED!: ${damageToInflict}`,
      "60px MedievalSharp",
      "lightblue",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    parryMessage.setVY(20);

    this.#stateMessages.push(parryMessage);
  }

  parryHalfFumbleMessage(damageToInflict, targetBox) {
    const parryMessage = new StateMessage(
      `PARRY HALF FUMBLE!: ${damageToInflict}`,
      "60px MedievalSharp",
      "lightblue",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    parryMessage.setVY(20);

    this.#stateMessages.push(parryMessage);
  }

  parryCritMessage(damageToInflict, targetBox) {
    const parryMessage = new StateMessage(
      `PARRY CRIT!: ${damageToInflict}`,
      "60px MedievalSharp",
      "lightblue",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    parryMessage.setVY(20);

    this.#stateMessages.push(parryMessage);
  }

  damageMessage(damageToInflict, targetBox, color) {
    const damageMessage = new StateMessage(
      damageToInflict,
      "20px MedievalSharp",
      color,
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() + 55,
      1,
      new Physics(0, 0)
    );

    damageMessage.setVY(20);

    this.#stateMessages.push(damageMessage);
  }

  #finishBreastplatePrimordialColossusPower(
    breastplatePrimordialColossusOwner
  ) {
    // CREATE AND STORE THE ARMOR'S POWER STATE MESSAGE
    let dmgReflectedBackOntoAttackerMsg =
      "THE DAMAGE WAS REFLECTED BACK ONTO THE ATTACKER!";
    dmgReflectedBackOntoAttackerMsg = new StateMessage(
      dmgReflectedBackOntoAttackerMsg,
      "30px MedievalSharp",
      "aqua",
      1,
      2,
      globals.canvas.width / 2,
      globals.canvas.height / 2,
      1,
      new Physics(0, 0)
    );

    dmgReflectedBackOntoAttackerMsg.setVY(20);

    this.#stateMessages.push(dmgReflectedBackOntoAttackerMsg);

    // CREATE AND STORE THE "ARMOR BROKE!" STATE MESSAGE
    const breastplatePrimordialColossusOwnerBox =
      breastplatePrimordialColossusOwner.getBoxIsPositionedIn(
        this.#enemyMovementGrid,
        breastplatePrimordialColossusOwner
      );
    this.#createAndStoreArmorBrokeMsg(breastplatePrimordialColossusOwnerBox);

    // RESET THE ARMOR'S ATTRIBUTES, INSERT IT INTO THE EVENTS DECK & REMOVE IT FROM ITS OWNER
    breastplatePrimordialColossusOwner.resetArmorAttributes();
    this.#eventDeck.insertCard(breastplatePrimordialColossusOwner.getArmor());
    breastplatePrimordialColossusOwner.removeArmor();
  }

  critMessage(targetBox) {
    const critMessage = new StateMessage(
      "CRITICAL HIT!",
      "60px MedievalSharp",
      "gold",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    critMessage.setVY(20);

    this.#stateMessages.push(critMessage);
  }

  fumbleMessage(targetBox) {
    const fumbleMessage = new StateMessage(
      "FUMBLE!",
      "60px MedievalSharp",
      "red",
      1,
      2,
      targetBox.getCard().getXCoordinate() + 55,
      targetBox.getCard().getYCoordinate() - 55,
      1,
      new Physics(0, 0)
    );

    fumbleMessage.setVY(20);

    this.#stateMessages.push(fumbleMessage);
  }

  weaponMessage(targetBox) {
    const weaponMessage = new StateMessage(
      "WEAPON BROKE!",
      "30px MedievalSharp",
      "red",
      1,
      2,
      targetBox.getCard().getXCoordinate() - 135,
      targetBox.getCard().getYCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height / 2,
      1,
      new Physics(0, 0)
    );

    weaponMessage.setVY(20);

    this.#stateMessages.push(weaponMessage);
  }

  deathMessage(target) {
    const deathMessage = new StateMessage(
      "MINION DIED!",
      "30px MedievalSharp",
      "red",
      1,
      2,
      target.getXCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2,
      target.getYCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height +
        15,
      1,
      new Physics(0, 0)
    );

    deathMessage.setVY(20);

    this.#stateMessages.push(deathMessage);
  }

  #createAndStoreArmorBrokeMsg(armorOwnerBox) {
    const armorBrokeMsg = new StateMessage(
      "ARMOR BROKE!",
      "30px MedievalSharp",
      "red",
      1,
      2,
      armorOwnerBox.getCard().getXCoordinate() + 240,
      armorOwnerBox.getCard().getYCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height / 2,
      1,
      new Physics(0, 0)
    );

    armorBrokeMsg.setVY(20);

    this.#stateMessages.push(armorBrokeMsg);
  }

  #applyOverflowDamage(armor, targetBox) {
    const overflow = Math.abs(armor.getCurrentDurability());
    armor.setCurrentDurability(0);

    const newHP = this.#target.getCurrentHP() - overflow;
    this.#target.setCurrentHP(Math.max(0, newHP));

    this.damageMessage(overflow, targetBox, "lightblue");
  }

  #handleCloakPower() {
    const canDodge = CloakOfEternalShadowSpecialEffect.canDodge(
      this.#target,
      this.#isArmorPowerChosen,
      this.#attacker.getWeaponTypeID()
    );

    if (canDodge) {
      // CREATE AND STORE THE ARMOR'S POWER STATE MESSAGE
      const dodgeMessage = new StateMessage(
        "THE WIZARD DODGED THE ATTACK USING THE CLOAK OF ETERNAL SHADOW!",
        "30px MedievalSharp",
        "aqua",
        1,
        2,
        globals.canvas.width / 2,
        globals.canvas.height / 2,
        1,
        new Physics(0, 0)
      );

      dodgeMessage.setVY(20);

      this.#stateMessages.push(dodgeMessage);

      // CREATE AND STORE THE "ARMOR BROKE!" STATE MESSAGE
      const cloakEternalShadowOwnerBox = this.#target.getBoxIsPositionedIn(
        this.#enemyMovementGrid,
        this.#target
      );
      this.#createAndStoreArmorBrokeMsg(cloakEternalShadowOwnerBox);

      this.#isArmorPowerChosen = false;

      // RESET THE ARMOR'S ATTRIBUTES, INSERT IT INTO THE EVENTS DECK & REMOVE IT FROM ITS OWNER
      this.#target.resetArmorAttributes();
      this.#eventDeck.insertCard(this.#target.getArmor());
      this.#target.removeArmor();

      return;
    }
  }
}
