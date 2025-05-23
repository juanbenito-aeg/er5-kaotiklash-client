import Card from "./Card.js";

export default class Armor extends Card {
  #armorTypeID;
  #armorTypeName;
  #specialEffect;
  #initialDurability;
  #currentDurability;
  #initialPrepTimeInRounds;
  #currentPrepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    armorTypeID,
    armorTypeName,
    specialEffect,
    initialDurability,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#armorTypeID = armorTypeID;
    this.#armorTypeName = armorTypeName;
    this.#specialEffect = specialEffect;
    this.#initialDurability = this.#currentDurability = initialDurability;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getArmorTypeID() {
    return this.#armorTypeID;
  }

  getArmorTypeName() {
    return this.#armorTypeName;
  }

  getSpecialEffect() {
    return this.#specialEffect;
  }

  getInitialDurability() {
    return this.#initialDurability;
  }

  getCurrentDurability() {
    return this.#currentDurability;
  }

  setCurrentDurability(newDurability) {
    this.#currentDurability = newDurability;
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

  resetAttributes() {
    this.#currentDurability = this.#initialDurability;
    this.#currentPrepTimeInRounds = this.#initialPrepTimeInRounds;
  }
}
