import globals from "../Game/globals.js";
import { BattlefieldArea } from "../Game/constants.js";

export default class SpecialSkillDecrepitThrone {
  #enemyBattlefieldGrid;
  #currentPlayer;
  #eventsData;

  constructor(enemyBattlefieldGrid, currentPlayer, eventsData) {
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#currentPlayer = currentPlayer;
    this.#eventsData = eventsData;
  }

  execute() {
    this.#eventsData.decrepitThroneSkill.isActive = true;
    this.#eventsData.decrepitThroneSkill.playerWithDecrepitThrone =
      this.#currentPlayer;

    this.applyEffect();
  }

  applyEffect() {
    const frontBoxes = [];
    const cardsToMove = [];
    const allBoxes = this.#enemyBattlefieldGrid.getBoxes();

    // SEARCH FOR ALL THE AVAILABLE BOXES IN THE FRONT AREA
    for (let i = 0; i < allBoxes.length; i++) {
      const box = allBoxes[i];

      if (
        box.getBattlefieldAreaItBelongsTo() === BattlefieldArea.FRONT &&
        !box.isOccupied()
      ) {
        frontBoxes.push(box);
      }
    }

    // FIND ALL THE CARDS IN THE OPPONENT'S BATTLEFIELD
    for (let i = 0; i < allBoxes.length; i++) {
      const box = allBoxes[i];

      if (box.isOccupied()) {
        cardsToMove.push(box.getCard());
      }
    }

    // MOVE CARDS TO THE FRONT AREA
    for (let i = 0; i < cardsToMove.length && i < frontBoxes.length; i++) {
      const card = cardsToMove[i];

      const currentBox = card.getBoxIsPositionedIn(
        this.#enemyBattlefieldGrid,
        card
      );
      currentBox.resetCard();

      const targetBox = frontBoxes[i];

      card.setXCoordinate(targetBox.getXCoordinate());
      card.setYCoordinate(targetBox.getYCoordinate());

      targetBox.setCard(card);
    }
  }

  resetRelatedVariables() {
    this.#eventsData.decrepitThroneSkill.isActive = false;
    this.#eventsData.decrepitThroneSkill.playerWithDecrepitThrone = {};
    this.#eventsData.decrepitThroneSkill.turnsSinceActivation = 0;
  }
}
