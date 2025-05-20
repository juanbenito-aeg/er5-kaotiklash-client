import Card from "./Card.js";
import globals from "../Game/globals.js";
import { Language } from "../Game/constants.js";

export default class MainCharacter extends Card {
  #specialSkill;

  constructor(category, id, name, description, specialSkill) {
    super(category, id, name, description);

    this.#specialSkill = specialSkill;
  }

  getSpecialSkill() {
    return this.#specialSkill;
  }

  renderSpecialSkill() {
    const specialSkillString =
      globals.language === Language.ENGLISH
        ? "Special Skill:"
        : "Trebetasun Berezia:";
    globals.ctx.fillText(specialSkillString, globals.canvas.width / 2, 785);

    this.#specialSkill.render();
  }
}
