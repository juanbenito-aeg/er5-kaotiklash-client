import Card from "./Card.js";

export default class Weapon extends Card {
  #type;
  #damage;
  #durability;
  #prepTimeInRounds;

  constructor(
    id,
    name,
    description,
    type,
    damage,
    durability,
    prepTimeInRounds
  ) {
    super(id, name, description);

    this.#type = type;
    this.#damage = damage;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
