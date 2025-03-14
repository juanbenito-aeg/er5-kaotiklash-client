import Card from "./Card.js";
import { CardCategory } from "../Game/constants.js";

export default class Armor extends Card {
  #category = CardCategory.EVENT;
  #armorType;
  #specialEffect;
  #durability;
  #prepTimeInRounds;

  constructor(
    id,
    name,
    description,
    armorType,
    specialEffect,
    durability,
    prepTimeInRounds
  ) {
    super(id, name, description);

    this.#armorType = armorType;
    this.#specialEffect = specialEffect;
    this.#durability = durability;
    this.#prepTimeInRounds = prepTimeInRounds;
  }
}
