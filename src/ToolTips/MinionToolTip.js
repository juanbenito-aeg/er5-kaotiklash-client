import ToolTip from "./ToolTip.js";
import { WeaponTypeID } from "../Game/constants.js";

export default class MinionTooltip extends ToolTip {
  constructor() {
    super();
  }

  getContent(minion) {
    let content = [];

    content.push(`HP: ${minion.getCurrentHP()}`);
    content.push(`Attack: ${minion.getCurrentAttack()}`);
    content.push(`Defense: ${minion.getCurrentDefense()}`);

    if (minion.getWeapon()) {
      let weapon = minion.getWeapon();
      content.push("--- WEAPON ---");
      content.push(`Name: ${weapon.getName()}`);
      content.push(`Damage: +${weapon.getCurrentDamage()}`);
      content.push(`Durability: ${weapon.getCurrentDurability()}`);
      content.push(`Type: ${this.getWeaponTypeName(weapon.getWeaponTypeID())}`);
    }

    if (minion.getArmor()) {
      let armor = minion.getArmor();
      content.push("--- ARMOR ---");
      content.push(`Name: ${armor.getName()}`);
      content.push(`Durability: ${armor.getCurrentDurability()}`);
    }

    return content;
  }

  getWeaponTypeName(typeId) {
    let typeNames = {
      [WeaponTypeID.MELEE]: "MELEE",
      [WeaponTypeID.MISSILE]: "MISSILE",
      [WeaponTypeID.HYBRID]: "HYBRID",
    };
    return typeNames[typeId];
  }
}
