import { globals } from "../index.js";
export default class SpecialSkillAngelo {
  #enemyBattlefieldGrid;
  #enemyEventsInPrepGrid;
  #playerBattlefieldGrid;
  #playerEventsInPrepGrid;
  #mouseInput;
  #currentPlayer;
  #executeBy;
  #isActive;

  constructor(
    playerBattlefieldGrid,
    playerEventsInPrepGrid,
    enemyBattlefieldGrid,
    enemyEventsInPrepGrid,
    mouseInput,
    executeBy
  ) {
    this.#playerBattlefieldGrid = playerBattlefieldGrid;
    this.#playerEventsInPrepGrid = playerEventsInPrepGrid;
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#enemyEventsInPrepGrid = enemyEventsInPrepGrid;
    this.#mouseInput = mouseInput;
    this.#executeBy = executeBy;
    this.#isActive = false;
  }

  execute() {
    this.#isActive = true;
    globals.activeVisibilitySkill = this;
  }

  restore() {
    this.#isActive = false;
    globals.activeVisibilitySkill = null;
  }

  renderVisibilityEffect(visiblePlayer) {
    const fieldWidth = globals.canvas.width * 0.45;
    const fieldHeight = globals.canvas.height * 0.8;
    const fieldX = (globals.canvas.width - fieldWidth) / 2;
    const fieldY = globals.canvas.height * 0.1;

    globals.ctx.save();
    globals.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    globals.ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);

    if (visiblePlayer === this.#executeBy) {
      const radius = 50;
      const circleX = this.#mouseInput.getMouseXCoordinate();
      const circleY = this.#mouseInput.getMouseYCoordinate();

      if (
        circleX >= fieldX &&
        circleX <= fieldX + fieldWidth &&
        circleY >= fieldY &&
        circleY <= fieldY + fieldHeight
      ) {
        globals.ctx.beginPath();
        globals.ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        globals.ctx.clip();
        globals.ctx.clearRect(
          circleX - radius,
          circleY - radius,
          radius * 2,
          radius * 2
        );
      }
    } else {
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
