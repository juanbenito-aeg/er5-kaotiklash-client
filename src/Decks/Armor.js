import Card from "./Card.js";

export default class Armor extends Card {
  #armorType;
  #specialEffect;
  #durability;
  #prepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    armorType,
    specialEffect,
    durability,
    prepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#armorType = armorType;
    this.#specialEffect = specialEffect;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }

  getArmorType() {
    return this.#armorType;
  }
}
