import Card from "./Card.js";

export default class Weapon extends Card {
  #weaponType;
  #initialDamage;
  #currentDamage;
  #initialDurability;
  #currentDurability;
  #initialPrepTimeInRounds;
  #currentPrepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    weaponType,
    initialDamage,
    initialDurability,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#weaponType = weaponType;
    this.#initialDamage = this.#currentDamage = initialDamage;
    this.#initialDurability = this.#currentDurability = initialDurability;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getWeaponType() {
    return this.#weaponType;
  }

  getInitialDamage() {
    return this.#initialDamage;
  }

  getCurrentDamage() {
    return this.#currentDamage;
  }

  getInitialDurability() {
    return this.#initialDurability;
  }

  getCurrentDurability() {
    return this.#currentDurability;
  }

  getInitialPrepTimeInRounds() {
    return this.#initialPrepTimeInRounds;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }
}
