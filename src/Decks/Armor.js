import Card from "./Card.js";

export default class Armor extends Card {
  #armorType;
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
    armorType,
    specialEffect,
    initialDurability,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#armorType = armorType;
    this.#specialEffect = specialEffect;
    this.#initialDurability = this.#currentDurability = initialDurability;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getArmorType() {
    return this.#armorType;
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

  getInitialPrepTimeInRounds() {
    return this.#initialPrepTimeInRounds;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }
}
