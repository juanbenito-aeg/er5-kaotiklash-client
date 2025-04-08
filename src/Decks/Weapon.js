import Card from "./Card.js";

export default class Weapon extends Card {
  #weaponTypeID;
  #weaponTypeName;
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
    weaponTypeID,
    weaponTypeName,
    initialDamage,
    initialDurability,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#weaponTypeID = weaponTypeID;
    this.#weaponTypeName = weaponTypeName;
    this.#initialDamage = this.#currentDamage = initialDamage;
    this.#initialDurability = this.#currentDurability = initialDurability;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getWeaponTypeID() {
    return this.#weaponTypeID;
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

  setCurrentPrepTimeInRounds(newPrepTimeInRounds) {
    this.#currentPrepTimeInRounds = newPrepTimeInRounds;
  }

  getBoxIsPositionedIn(gridWhereToLookForBox, weapon) {
    for (let i = 0; i < gridWhereToLookForBox.getBoxes().length; i++) {
      const currentBox = gridWhereToLookForBox.getBoxes()[i];

      if (currentBox.getCard() === weapon) {
        return currentBox;
      }
    }
  }

  setCurrentDurability(newDurability) {
    this.#currentDurability = newDurability;
  }
}
