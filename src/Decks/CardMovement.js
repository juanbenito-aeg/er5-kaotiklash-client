export default class CardMovement {
  #card;
  #previousState;
  #state;

  constructor(card, state) {
    this.#card = card;
    this.#state = state;
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

  getCurrentArmorDurability() {
    return this.#card.getCurrentDurability();
  }

  getCurrentArmorPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds();
  }

  getSpecialCurrentDurationInRounds() {
    return this.#card.getCurrentDurationInRounds();
  }

  getSpecialCurrentPrepTimeInRounds() {
    return this.#card.getCurrentPrepTimeInRounds();
  }

  getRareCurrentDurationInRounds() {
    return this.#card.getCurrentDurationInRounds();
  }

  getXCoordinate() {
    return this.#card.getXCoordinate();
  }

  getYCoordinate() {
    return this.#card.getYCoordinate();
  }

  setXCoordinate(newXCoordinate) {
    return this.#card.setXCoordinate(newXCoordinate);
  }

  setYCoordinate(newYCoordinate) {
    return this.#card.setYCoordinate(newYCoordinate);
  }

  getImageSet() {
    return this.#card.getImageSet();
  }

  getPreviousState() {
    return this.#previousState;
  }

  setPreviousState(newPreviousState) {
    this.#previousState = newPreviousState;
  }

  getState() {
    return this.#state;
  }

  setState(newState) {
    this.#state = newState;
  }
}
