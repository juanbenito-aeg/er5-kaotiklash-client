import globals from "../Game/globals.js";

export default class SpecialSkillAngelo {
  #enemyBattlefieldGrid;
  #enemyEventsInPrepGrid;
  #mouseInput;
  #executeBy;
  #stateMessages;

  constructor(
    enemyBattlefieldGrid,
    enemyEventsInPrepGrid,
    mouseInput,
    executeBy,
    stateMessages
  ) {
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#enemyEventsInPrepGrid = enemyEventsInPrepGrid;
    this.#mouseInput = mouseInput;
    this.#executeBy = executeBy;
    this.#stateMessages = stateMessages;
  }

  execute() {
    globals.activeVisibilitySkill = this;
  }

  restore() {
    globals.activeVisibilitySkill = null;
  }

  renderVisibilityEffect(visiblePlayer) {
    const fieldWidth = globals.canvas.width * 0.45;
    const fieldHeight = globals.canvas.height * 0.8;
    const fieldX = (globals.canvas.width - fieldWidth) / 2;
    const fieldY = globals.canvas.height * 0.1;

    // MESSAGE COORDINATES
    const centerX = fieldX + fieldWidth / 2;
    const centerY = fieldY + fieldHeight / 2;

    globals.ctx.save();

    if (visiblePlayer === this.#executeBy.getID()) {
      const radius = 50;
      const circleX = this.#mouseInput.getMouseXCoordinate();
      const circleY = this.#mouseInput.getMouseYCoordinate();

      globals.ctx.beginPath();
      globals.ctx.rect(fieldX, fieldY, fieldWidth, fieldHeight);
      globals.ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      globals.ctx.clip("evenodd");
      globals.ctx.fillStyle = "rgba(0, 0, 0, 1)";
      globals.ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);
    } else {
      globals.ctx.save();
      globals.ctx.rect(fieldX, fieldY, fieldWidth, fieldHeight);
      globals.ctx.fillStyle = "rgba(0, 0, 0, 1)";
      globals.ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);
      globals.ctx.globalCompositeOperation = "source-over";
      globals.ctx.strokeStyle = "rgba(226, 22, 22, 0.3)";
      globals.ctx.lineWidth = 2;
      1;
      const enemieBoxes = [
        ...this.#enemyEventsInPrepGrid.getBoxes(),
        ...this.#enemyBattlefieldGrid.getBoxes(),
      ];

      for (let i = 0; i < enemieBoxes.length; i++) {
        const box = enemieBoxes[i];
        if (box.isMouseOver()) {
          globals.ctx.strokeRect(
            box.getXCoordinate(),
            box.getYCoordinate(),
            box.getWidth(),
            box.getHeight()
          );
        }
      }
    }
    globals.ctx.restore();
  }
}
