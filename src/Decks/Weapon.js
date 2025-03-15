import Card from "./Card.js";

export default class Weapon extends Card {
  #weaponType;
  #damage;
  #durability;
  #prepTimeInRounds;

  constructor(
    category,
    id,
    name,
    description,
    weaponType,
    damage,
    durability,
    prepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#weaponType = weaponType;
    this.#damage = damage;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
