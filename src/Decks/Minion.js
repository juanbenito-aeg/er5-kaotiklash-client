import Card from "./Card.js";

export default class Minion extends Card {
  #minionTypeID;
  #minionTypeName;
  #initialHP;
  #currentHP;
  #initialMadness;
  #currentMadness;
  #initialStrength;
  #currentStrength;
  #initialAttack;
  #currentAttack;
  #initialConstitution;
  #currentConstitution;
  #hasUsedArmorPower;
  #initialDefense;
  #currentDefense;
  #weapon;
  #armor;

  constructor(
    category,
    id,
    name,
    description,
    minionTypeID,
    minionTypeName,
    initialHP,
    initialMadness,
    initialStrength,
    initialAttack,
    initialConstitution,
    initialDefense
  ) {
    super(category, id, name, description);

    this.#minionTypeID = minionTypeID;
    this.#minionTypeName = minionTypeName;
    this.#initialHP = this.#currentHP = initialHP;
    this.#initialMadness = this.#currentMadness = initialMadness;
    this.#initialStrength = this.#currentStrength = initialStrength;
    this.#initialAttack = this.#currentAttack = initialAttack;
    this.#initialConstitution = this.#currentConstitution = initialConstitution;
    this.#initialDefense = this.#currentDefense = initialDefense;
    this.#hasUsedArmorPower = false;
    this.#weapon = null;
    this.#armor = null;
  }

  getMinionTypeID() {
    return this.#minionTypeID;
  }

  getInitialHP() {
    return this.#initialHP;
  }

  getCurrentHP() {
    return this.#currentHP;
  }

  setCurrentHP(newHP) {
    this.#currentHP = newHP;
  }

  getInitialMadness() {
    return this.#initialMadness;
  }

  getCurrentMadness() {
    return this.#currentMadness;
  }

  setCurrentMadness(newMadness) {
    this.#currentMadness = newMadness;
  }

  getInitialAttack() {
    return this.#initialAttack;
  }

  getCurrentAttack() {
    return this.#currentAttack;
  }

  setCurrentAttack(newAttack) {
    this.#currentAttack = newAttack;
  }

  getInitialConstitution() {
    return this.#currentConstitution;
  }

  setCurrentConstitution(newConstitution) {
    this.#currentConstitution = newConstitution;
  }

  getInitialDefense() {
    return this.#initialDefense;
  }

  getCurrentDefense() {
    return this.#currentDefense;
  }

  setCurrentDefense(newDefense) {
    this.#currentDefense = newDefense;
  }

  getInitialStrength() {
    return this.#initialStrength;
  }

  getCurrentStrength() {
    return this.#currentStrength;
  }

  setCurrentStrength(newStrength) {
    this.#currentStrength = newStrength;
  }

  getWeapon() {
    return this.#weapon;
  }

  setWeapon(weapon) {
    this.#weapon = weapon;
  }

  removeWeapon() {
    this.#weapon = null;
  }

  resetWeaponAttributes() {
    this.#weapon.resetAttributes();
  }

  getWeaponTypeID() {
    return this.#weapon.getWeaponTypeID();
  }

  getWeaponCurrentDamage() {
    return this.#weapon.getCurrentDamage();
  }

  getBoxIsPositionedIn(gridWhereToLookForBox, minion) {
    for (let i = 0; i < gridWhereToLookForBox.getBoxes().length; i++) {
      const currentBox = gridWhereToLookForBox.getBoxes()[i];

      if (currentBox.getCard() === minion) {
        return currentBox;
      }
    }
  }

  getCritChance() {
    // Critical Hit Probability (%) = ((Madness + Strength + Attack) / 3) * 0.4
    const critChance =
      ((this.#currentMadness + this.#currentStrength + this.#currentAttack) /
        3) *
      0.4;
    return critChance;
  }

  getFumbleChance() {
    // Fumble/Self-Damage Probability (%) = ((Madness + Attack) / 2) * 0.2
    const fumbleChance =
      ((this.#currentMadness + this.#currentAttack) / 2) * 0.2;
    return fumbleChance;
  }

  setCurrentDurability(newDurability) {
    this.#weapon.setCurrentDurability(newDurability);
  }

  getParryFumbleChance() {
    // Probability (%) = (Madness * 0.005) * 100    const fumbleChance =
    const fumbleChance = this.#currentMadness * 0.005 * 100;
    return fumbleChance;
  }

  getParryCritChance() {
    // Probability (%) = (Madness * 0.0035) * 100
    const critChance = this.#currentMadness * 0.0035 * 100;
    return critChance;
  }

  getHalfParryFumbleChance() {
    // The weapon blocks the damage previously calculated * 1.25.
    // Probability (%) = (Madness * 0.01) * 100
    const HalffumbleChance = this.#currentMadness * 0.01 * 100;
    return HalffumbleChance;
  }

  getArmor() {
    return this.#armor;
  }

  setArmor(armor) {
    this.#armor = armor;
  }

  removeArmor() {
    this.#armor = null;
  }

  resetArmorAttributes() {
    this.#armor.resetAttributes();
  }

  getArmorID() {
    return this.#armor.getID();
  }

  getArmorTypeID() {
    return this.#armor.getArmorTypeID();
  }

  getArmorCurrentDurability() {
    return this.#armor.getCurrentDurability();
  }

  setCurrentDurability(newDurability) {
    this.#armor.setCurrentDurability(newDurability);
  }

  resetArmorAttributes() {
    this.#armor.resetAttributes();
  }
}
