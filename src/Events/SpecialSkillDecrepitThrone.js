import { globals } from "../index.js";
import { BattlefieldArea, BoxState } from "../Game/constants.js";

export default class SpecialSkillDecrepitThrone {
  #enemyBattlefieldGrid;
  #currentPlayer;

  constructor(enemyBattlefieldGrid, currentPlayer) {
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#currentPlayer = currentPlayer;
  }

  execute() {
    globals.activePlayerWithDecrepitThrone = this.#currentPlayer;
    this.#applyEffect();
  }

  restore() {
    globals.isDecrepitThroneActive = false;
    globals.activePlayerWithDecrepitThrone = null;
  }

  #applyEffect() {
    const frontBoxes = [];
    const cardsToMove = [];
    const allBoxes = this.#enemyBattlefieldGrid.getBoxes();
    globals.isDecrepitThroneActive = true;

    //SEARCH ALL AVIABLE BOXES IN FRONT
    for (let i = 0; i < allBoxes.length; i++) {
      const box = allBoxes[i];
      if (
        box.getBattlefieldAreaItBelongsTo() === BattlefieldArea.FRONT &&
        !box.isOccupied()
      ) {
        frontBoxes.push(box);
      }
    }
    //FIND ALL CARDS IN THE ENEMY`S AREA
    for (let i = 0; i < allBoxes.length; i++) {
      const box = allBoxes[i];
      if (box.isOccupied()) {
        cardsToMove.push(box.getCard());
      }
    }

    //MOVE CARDS TO FRONT
    for (let i = 0; i < cardsToMove.length && i < frontBoxes.length; i++) {
      const card = cardsToMove[i];
      const currentBox = card.getBoxIsPositionedIn(
        this.#enemyBattlefieldGrid,
        card
      );

      if (currentBox) {
        currentBox.resetCard();
      }

      const targetBox = frontBoxes[i];
      card.setXCoordinate(targetBox.getXCoordinate());
      card.setYCoordinate(targetBox.getYCoordinate());
      targetBox.setCard(card);
      targetBox.setState(BoxState.OCCUPIED);
    }
  }
}
