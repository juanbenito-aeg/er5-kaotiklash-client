import Card from "./Card.js";

export default class Armor extends Card {
  #type;
  #specialEffect;
  #durability;
  #prepTimeInRounds;

  constructor(
    id,
    name,
    description,
    type,
    specialEffect,
    durability,
    prepTimeInRounds
  ) {
    super(id, name, description);

    this.#type = type;
    this.#specialEffect = specialEffect;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
