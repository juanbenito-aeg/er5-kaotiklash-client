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

  getCurrentDurability() {
    return this.#currentDurability;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }
}
