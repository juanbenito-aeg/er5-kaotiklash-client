import Card from "./Card.js";
import globals from "../Game/globals.js";
import { ArmorTypeID, Language } from "../Game/constants.js";

export default class Armor extends Card {
  #armorTypeID;
  #armorTypeName;
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
    armorTypeID,
    armorTypeName,
    specialEffect,
    initialDurability,
    initialPrepTimeInRounds
  ) {
    super(category, id, name, description);

    this.#armorTypeID = armorTypeID;
    this.#armorTypeName = armorTypeName;
    this.#specialEffect = specialEffect;
    this.#initialDurability = this.#currentDurability = initialDurability;
    this.#initialPrepTimeInRounds = this.#currentPrepTimeInRounds =
      initialPrepTimeInRounds;
  }

  getArmorTypeID() {
    return this.#armorTypeID;
  }

  getArmorTypeName() {
    return this.#armorTypeName;
  }

  getSpecialEffect() {
    return this.#specialEffect;
  }

  renderSpecialEffect() {
    if (this.#armorTypeID !== ArmorTypeID.MEDIUM) {
      let specialEffectUsableBy;

      if (this.#armorTypeID === ArmorTypeID.HEAVY) {
        specialEffectUsableBy =
          globals.language === Language.ENGLISH ? "Warriors" : "Gudariek";
      } else {
        specialEffectUsableBy =
          globals.language === Language.ENGLISH ? "Wizards" : "Magoek";
      }

      const specialEffectString =
        globals.language === Language.ENGLISH
          ? `Special Effect Usable by ${specialEffectUsableBy}:`
          : `${specialEffectUsableBy} Erabil Dezaketen Efektu Berezia:`;
      globals.ctx.fillText(specialEffectString, globals.canvas.width / 2, 745);

      this.#specialEffect.render();
    }
  }

  getInitialDurability() {
    return this.#initialDurability;
  }

  getCurrentDurability() {
    return this.#currentDurability;
  }

  setCurrentDurability(newDurability) {
    this.#currentDurability = newDurability;
  }

  getInitialPrepTimeInRounds() {
    return this.#initialPrepTimeInRounds;
  }

  getCurrentPrepTimeInRounds() {
    return this.#currentPrepTimeInRounds;
  }

  setCurrentPrepTimeInRounds(newPrepTimeInRounds) {
    this.#currentPrepTimeInRounds = newPrepTimeInRounds;
  }

  resetAttributes() {
    this.#currentDurability = this.#initialDurability;
    this.#currentPrepTimeInRounds = this.#initialPrepTimeInRounds;
  }
}
