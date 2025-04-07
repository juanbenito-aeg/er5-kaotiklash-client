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
  #initialDefense;
  #currentDefense;
  #weapon;

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
    this.#weapon = null;
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

  getInitialMadness() {
    return this.#initialMadness;
  }

  getCurrentMadness() {
    return this.#currentMadness;
  }

  getInitialAttack() {
    return this.#initialAttack;
  }

  getCurrentAttack() {
    return this.#currentAttack;
  }

  getInitialConstitution() {
    return this.#currentConstitution;
  }

  getInitialDefense() {
    return this.#initialDefense;
  }

  getCurrentDefense() {
    return this.#currentDefense;
  }

  getInitialStrength() {
    return this.#initialStrength;
  }

  getCurrentStrength() {
    return this.#currentStrength;
  }

  setCurrentMadness(newMadness) {
    this.#currentMadness = newMadness;
  }

  setCurrentStrength(newStrength) {
    this.#currentStrength = newStrength;
  }

  getWeapon() {
    return this.#weapon;
  }

  getWeaponTypeID() {
    return this.#weapon.getWeaponTypeID();
  }

  getWeaponCurrentDamage() {
    return this.#weapon.getCurrentDamage();
  }

  setCurrentHP(newHP) {
    this.#currentHP = newHP;
  }

  setCurrentAttack(newAttack) {
    this.#currentAttack = newAttack;
  }

  setCurrentDefense(newDefense) {
    this.#currentDefense = newDefense;
  }

  setWeapon(weapon) {
    this.#weapon = weapon;
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
    //Critical Hit Probability (%) = ((Madness + Strength + Attack) / 3) * 0.4
    const critChance =
      ((this.#currentMadness + this.#currentStrength + this.#currentAttack) /
        3) *
      0.4;
    return critChance;
  }

  getFumbleChance() {
    //Fumble/Self-Damage Probability (%) = ((Madness + Attack) / 2) * 0.2
    const fumbleChance =
      ((this.#currentMadness + this.#currentAttack) / 2) * 0.2;
    return fumbleChance;
  }

}
