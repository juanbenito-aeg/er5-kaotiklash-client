import Tooltip from "./Tooltip.js";

export default class MinionTooltip extends Tooltip {
  constructor() {
    super();
  }

  getContent(minion) {
    const content = [];

    content.push(`HP: ${minion.getCurrentHP()}`);
    content.push(`Attack: ${minion.getCurrentAttack()}`);
    content.push(`Defense: ${minion.getCurrentDefense()}`);

    if (minion.getWeapon()) {
      const weapon = minion.getWeapon();

      content.push("--- WEAPON ---");
      content.push(`Type: ${weapon.getWeaponTypeName()}`);
      content.push(`Name: ${weapon.getName()}`);
      content.push(`Damage: ${weapon.getCurrentDamage()}`);
      content.push(`Durability: ${weapon.getCurrentDurability()}`);
    }

    if (minion.getArmor()) {
      const armor = minion.getArmor();

      content.push("--- ARMOR ---");
      content.push(`Type: ${armor.getArmorTypeName()}`);
      content.push(`Name: ${armor.getName()}`);
      content.push(`Durability: ${armor.getCurrentDurability()}`);
    }

    return content;
  }
}
