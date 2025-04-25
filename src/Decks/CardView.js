export default class CardView {
  #card;
  #xCoordinate;
  #yCoordinate;
  #imageSet;

  constructor(card, xCoordinate, yCoordinate, imageSet) {
    this.#card = card;
    this.#xCoordinate = xCoordinate;
    this.#yCoordinate = yCoordinate;
    this.#imageSet = imageSet;
  }

  getCategory() {
    return this.#card.getCategory();
  }

  getID() {
    return this.#card.getID();
  }

  getName() {
    return this.#card.getName();
  }

  getDescription() {
    return this.#card.getDescription();
  }

  resetAttributes() {
    this.#card.resetAttributes();
  }

  getSpecialSkill() {
    return this.#card.getSpecialSkill();
  }

  getMinionTypeID() {
    return this.#card.getMinionTypeID();
  }

  getInitialHP() {
    return this.#card.getInitialHP();
  }

  getCurrentHP() {
    return this.#card.getCurrentHP();
  }

  getInitialMadness() {
    return this.#card.getInitialMadness();
  }

  getCurrentMadness() {
    return this.#card.getCurrentMadness();
  }

  getInitialStrength() {
    return this.#card.getInitialStrength();
  }

  getCurrentStrength() {
    return this.#card.getCurrentStrength();
  }

  setCurrentMadness(newMadness) {
    this.#card.setCurrentMadness(newMadness);
  }

  setCurrentStrength(newStrength) {
    this.#card.setCurrentStrength(newStrength);
  }

  getInitialAttack() {
    return this.#card.getInitialAttack();
  }

  getCurrentAttack() {
    return this.#card.getCurrentAttack();
  }

  getInitialConstitution() {
    return this.#card.getInitialConstitution();
  }

  setCurrentConstitution(newConstitution) {
    this.#card.setCurrentConstitution(newConstitution);
  }

  setCurrentAttack(newAttack) {
    this.#card.setCurrentAttack(newAttack);
  }

  setCurrentDefense(newDefense) {
    this.#card.setCurrentDefense(newDefense);
  }

  getInitialDefense() {
    return this.#card.getInitialDefense();
  }

  getCurrentDefense() {
    return this.#card.getCurrentDefense();
  }

  getInitialDamage() {
    return this.#card.getInitialDamage();
  }

  getInitialDurability() {
    return this.#card.getInitialDurability();
  }

  getInitialPrepTimeInRounds() {
    return this.#card.getInitialPrepTimeInRounds();
  }

  getCurrentDamage() {
    return this.#card.getCurrentDamage();
  }

  getCurrentDurability() {
    return this.#card.getCurrentDurability();
  }

  getCurrentPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds();
  }

  getInitialDurability() {
    return this.#card.getInitialDurability();
  }

  getInitialPrepTimeInRounds() {
    return this.#card.getInitialPrepTimeInRounds();
  }

  getCurrentDurability() {
    return this.#card.getCurrentDurability();
  }

  getCurrentPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds();
  }

  getInitialDurationInRounds() {
    return this.#card.getIntialDurationInRounds();
  }

  getInitialPrepTimeInRounds() {
    return this.#card.getInitialPrepTimeInRounds();
  }

  getCurrentDurationInRounds() {
    return this.#card.getCurrentDurationInRounds();
  }

  getCurrentPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds();
  }

  getInitialDurationInRounds() {
    return this.#card.getInitialDurationInRounds();
  }

  getCurrentDurationInRounds() {
    return this.#card.getCurrentDurationInRounds();
  }

  getSpecialEffect() {
    return this.#card.getSpecialEffect();
  }

  getEffect() {
    return this.#card.getEffect();
  }

  getChaoticEventName() {
    return this.#card.getChaoticEventName();
  }

  getChaoticEventDescription() {
    return this.#card.getChaoticEventDescription();
  }

  getImageSet() {
    return this.#imageSet;
  }

  getXCoordinate() {
    return this.#xCoordinate;
  }

  getYCoordinate() {
    return this.#yCoordinate;
  }

  setXCoordinate(newXCoordinate) {
    this.#xCoordinate = newXCoordinate;
  }

  setYCoordinate(newYCoordinate) {
    this.#yCoordinate = newYCoordinate;
  }

  getCard() {
    return this.#card;
  }

  getWeapon() {
    return this.#card.getWeapon();
  }

  setWeapon(weapon) {
    this.#card.setWeapon(weapon);
  }

  removeWeapon() {
    this.#card.removeWeapon();
  }

  resetWeaponAttributes() {
    this.#card.resetWeaponAttributes();
  }

  getWeaponTypeID() {
    return this.#card.getWeaponTypeID();
  }

  getWeaponTypeName() {
    return this.#card.getWeaponTypeName();
  }

  getMinionWeaponTypeID() {
    return this.#card.getWeapon().getWeaponTypeID();
  }

  getWeaponCurrentDamage() {
    return this.#card.getWeapon().getCurrentDamage();
  }

  setCurrentHP(newHP) {
    this.#card.setCurrentHP(newHP);
  }

  setCurrentPrepTimeInRounds(newPrepTimeInRounds) {
    this.#card.setCurrentPrepTimeInRounds(newPrepTimeInRounds);
  }

  setCurrentDurationInRounds(newDuration) {
    this.#card.setCurrentDurationInRounds(newDuration);
  }

  setCurrentDurationInRounds(newDuration) {
    this.#card.setCurrentDurationInRounds(newDuration);
  }

  isMouseOver() {
    return this.#card.isMouseOver();
  }

  setIsMouseOver(isMouseOver) {
    this.#card.setIsMouseOver(isMouseOver);
  }

  isLeftClicked() {
    return this.#card.isLeftClicked();
  }

  setIsLeftClicked(isLeftClicked) {
    this.#card.setIsLeftClicked(isLeftClicked);
  }

  isRightClicked() {
    return this.#card.isRightClicked();
  }

  setIsRightClicked(isRightClicked) {
    this.#card.setIsRightClicked(isRightClicked);
  }

  getBoxIsPositionedIn(gridWhereToLookForBox, card) {
    return this.#card.getBoxIsPositionedIn(gridWhereToLookForBox, card);
  }

  getCritChance() {
    return this.#card.getCritChance();
  }

  getFumbleChance() {
    return this.#card.getFumbleChance();
  }

  setCurrentDurability(newDurability) {
    this.#card.setCurrentDurability(newDurability);
  }

  getParryFumbleChance() {
    return this.#card.getParryFumbleChance();
  }

  getParryCritChance() {
    return this.#card.getParryCritChance();
  }

  getHalfParryFumbleChance() {
    return this.#card.getHalfParryFumbleChance();
  }

  getInitialPrepTimeInRounds() {
    return this.#card.getInitialPrepTimeInRounds();
  }

  getCurrentInitialPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds;
  }

  setCurrentPrepTimeInRounds(newPrepTimeInRounds) {
    this.#card.setCurrentPrepTimeInRounds(newPrepTimeInRounds);
  }

  getArmor() {
    return this.#card.getArmor();
  }

  setArmor(armor) {
    this.#card.setArmor(armor);
  }

  removeArmor() {
    this.#card.removeArmor();
  }

  resetArmorAttributes() {
    this.#card.resetArmorAttributes();
  }

  getArmorTypeID() {
    return this.#card.getArmorTypeID();
  }

  getArmorTypeName() {
    return this.#card.getArmorTypeName();
  }

  getArmorID() {
    return this.#card.getArmorID();
  }

  getArmorCurrentDurability() {
    return this.#card.getArmor().getCurrentDurability();
  }

  setCurrentDurability(newDurability) {
    this.#card.setCurrentDurability(newDurability);
  }
}
