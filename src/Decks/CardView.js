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

  getSpecialSkill() {
    return this.#card.getSpecialSkill();
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

  getInitialAttack() {
    return this.#card.getInitialAttack();
  }

  getCurrentAttack() {
    return this.#card.getCurrentAttack();
  }

  getInitialDefense() {
    return this.#card.getInitialDefense();
  }

  getCurrentDefense() {
    return this.#card.getCurrentDefense();
  }

  getWeaponType() {
    return this.#card.getWeaponType();
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

  getArmorType() {
    return this.#card.getArmorType();
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

  getMinionWeaponType() {
    return this.#card.getWeapon().getWeaponType();
  }

  getWeaponCurrentDamage() {
    return this.#card.getWeapon().getCurrentDamage();
  }

  setCurrentHP(newHP) {
    this.#card.setCurrentHP(newHP);
  }

  setWeapon(weapon) {
    this.#card.setWeapon(weapon);
  }

  setCurrenPrepTimeInRounds(newPrepTimeInRounds) {
    this.#card.setCurrenPrepTimeInRounds(newPrepTimeInRounds);
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

  getBoxIsPositionedIn(gridWhereToLookForBox, minion) {
    return this.#card.getBoxIsPositionedIn(gridWhereToLookForBox, minion);
  }
}
