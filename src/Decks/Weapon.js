import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Weapon extends Card {
  #category = CardCategory.WEAPON;
  #weaponType;
  #damage;
  #durability;
  #prepTimeInRounds;

  constructor(
    id,
    name,
    description,
    weaponType,
    damage,
    durability,
    prepTimeInRounds
  ) {
    super(id, name, description);

    this.#weaponType = weaponType;
    this.#damage = damage;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
