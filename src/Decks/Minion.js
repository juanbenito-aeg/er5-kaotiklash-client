import Card from "./Card.js";

export default class Minion extends Card {
  #minionType;
  #hp;
  #madness;
  #strength;
  #attack;
  #constitution;
  #defense;

  constructor(
    category,
    id,
    name,
    description,
    minionType,
    hp,
    madness,
    strength,
    attack,
    constitution,
    defense
  ) {
    super(category, id, name, description);

    this.#minionType = minionType;
    this.#hp = hp;
    this.#madness = madness;
    this.#strength = strength;
    this.#attack = attack;
    this.#constitution = constitution;
    this.#defense = defense;
  }

  getMinionType() {
    return this.#minionType;
  }
}
