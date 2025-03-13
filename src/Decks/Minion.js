import Card from "./Card.js";

export default class Minion extends Card {
  #category;
  #hp;
  #madness;
  #strength;
  #attack;
  #constitution;
  #defense;

  constructor(
    id,
    name,
    description,
    category,
    hp,
    madness,
    strength,
    attack,
    constitution,
    defense
  ) {
    super(id, name, description);

    this.#category = category;
    this.#hp = hp;
    this.#madness = madness;
    this.#strength = strength;
    this.#attack = attack;
    this.#constitution = constitution;
    this.#defense = defense;
  }
}
