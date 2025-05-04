import Tooltip from "./Tooltip.js";

export default class ArmorTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(armor) {
    const content = [];

    content.push(`🛡️ Armor: ${armor.getName()}`);
    content.push(`🔸 Type: ${armor.getArmorTypeName()}`);
    content.push(`🔧 Durability: ${armor.getCurrentDurability()}`);

    return content;
  }
}
