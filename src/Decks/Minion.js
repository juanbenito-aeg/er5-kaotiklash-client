import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Minion extends Card {
  #category = CardCategory.MINION;
  #minionType;
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
    minionType,
    hp,
    madness,
    strength,
    attack,
    constitution,
    defense
  ) {
    super(id, name, description);

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
