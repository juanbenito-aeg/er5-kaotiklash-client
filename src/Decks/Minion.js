import Card from "./Card.js";

export default class Minion extends Card {
  #minionTypeID;
  #minionTypeName;
  #initialHP;
  #currentHP;
  #initialMadness;
  #currentMadness;
  #initialStrength;
  #currentStrength;
  #initialAttack;
  #currentAttack;
  #initialConstitution;
  #currentConstitution;
  #initialDefense;
  #currentDefense;
  #weapon;

  constructor(
    category,
    id,
    name,
    description,
    minionTypeID,
    minionTypeName,
    initialHP,
    initialMadness,
    initialStrength,
    initialAttack,
    initialConstitution,
    initialDefense
  ) {
    super(category, id, name, description);

    this.#minionTypeID = minionTypeID;
    this.#minionTypeName = minionTypeName;
    this.#initialHP = this.#currentHP = initialHP;
    this.#initialMadness = this.#currentMadness = initialMadness;
    this.#initialStrength = this.#currentStrength = initialStrength;
    this.#initialAttack = this.#currentAttack = initialAttack;
    this.#initialConstitution = this.#currentConstitution = initialConstitution;
    this.#initialDefense = this.#currentDefense = initialDefense;
    this.#weapon = null;
  }

  getMinionTypeID() {
    return this.#minionTypeID;
  }

  getInitialHP() {
    return this.#initialHP;
  }

  getCurrentHP() {
    return this.#currentHP;
  }

  getInitialMadness() {
    return this.#initialMadness;
  }

  getCurrentMadness() {
    return this.#currentMadness;
  }

  getInitialAttack() {
    return this.#initialAttack;
  }

  getCurrentAttack() {
    return this.#currentAttack;
  }

  getInitialDefense() {
    return this.#initialDefense;
  }

  getCurrentDefense() {
    return this.#currentDefense;
  }

  getWeapon() {
    return this.#weapon;
  }

  getWeaponTypeID() {
    return this.#weapon.getWeaponTypeID();
  }

  getWeaponCurrentDamage() {
    return this.#weapon.getCurrentDamage();
  }

  setCurrentHP(newHP) {
    this.#currentHP = newHP;
  }

  setWeapon(weapon) {
    this.#weapon = weapon;
  }
}
