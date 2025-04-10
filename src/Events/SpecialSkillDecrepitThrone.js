import { BattlefieldArea } from "../Game/constants.js";
import { globals } from "../index.js";

export default class SpecialSkillDecrepitThrone {
  #enemyBattlefieldGrid;
  #currentPlayer;

  constructor(enemyBattlefieldGrid, currentPlayer) {
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#currentPlayer = currentPlayer;
  }

  execute() {
    globals.decrepitThroneSkillData.isActive = true;
    globals.decrepitThroneSkillData.playerWithDecrepitThrone =
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
    globals.decrepitThroneSkillData.isActive = false;
    globals.decrepitThroneSkillData.playerWithDecrepitThrone = {};
    globals.decrepitThroneSkillData.turnsSinceActivation = 0;
  }
}
