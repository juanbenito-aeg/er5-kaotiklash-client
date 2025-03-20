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

  getInitialDurability() {
    return this.#initialDurability;
  }

  getInitialPrepTimeInRounds() {
    return this.#initialPrepTimeInRounds;
  }

  geCurrenttDamage() {
    return this.#currentDamage;
  }

  getCurrentDurability() {
    return this.#currentDurability;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }
}
