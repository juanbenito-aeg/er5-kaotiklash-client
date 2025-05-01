import Tooltip from "./Tooltip.js";
import globals from "../Game/globals.js";

export default class MinionTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(minion) {
    const content = [];
    const typeMinionEmoji = {
      0: "🦌",
      1: "🗡️",
      2: "🧙‍♂️",
    };

    if (minion.getWeapon() || minion.getArmor()) {
      const emojiType = typeMinionEmoji[minion.getMinionTypeID()];
      content.push(`${emojiType} Minion: ${minion.getName()}`);
    }

    content.push(`❤️ HP: ${minion.getCurrentHP()}`);
    content.push(`⚔️ Attack: ${minion.getCurrentAttack()}`);
    content.push(`🛡️ Defense: ${minion.getCurrentDefense()}`);

    if (minion.getWeapon()) {
      const weapon = minion.getWeapon();
      const current = weapon.getCurrentDurability();
      const max = weapon.getInitialDurability();
      const isLow = current < max * 0.5;

      content.push("");
      content.push(`⚔️ Weapon:  ${weapon.getName()}`);
      content.push(`🔸 Type: ${weapon.getWeaponTypeName()}`);
      content.push(`💥 Damage: ${weapon.getCurrentDamage()}`);
      const durabilityText = `🔧 Durability: ${current}`;
      if (isLow) {
        content.push({
          text: durabilityText,
          color: "#e74c3c",
        });
      } else {
        content.push(durabilityText);
      }
    }

    if (minion.getArmor()) {
      const armor = minion.getArmor();
      const current = armor.getCurrentDurability();
      const initial = armor.getInitialDurability();
      const isLow = current < initial / 2;

      content.push("");
      content.push(`🛡️ Armor:  ${armor.getName()}`);
      content.push(`🔸 Type: ${armor.getArmorTypeName()}`);
      const durabilityText = `🔧 Durability: ${current}`;
      if (isLow) {
        content.push({
          text: durabilityText,
          color: "#e74c3c",
        });
      } else {
        content.push(durabilityText);
      }
    }

    return content;
  }
}
