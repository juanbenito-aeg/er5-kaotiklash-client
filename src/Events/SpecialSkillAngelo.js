import globals from "../Game/globals.js";
import StateMessage from "../Messages/StateMessage.js";

export default class SpecialSkillAngelo {
  #enemyBattlefieldGrid;
  #enemyEventsInPrepGrid;
  #mouseInput;
  #executeBy;
  #stateMessages;
  #eventsData;

  constructor(
    enemyBattlefieldGrid,
    enemyEventsInPrepGrid,
    mouseInput,
    executeBy,
    stateMessages,
    eventsData
  ) {
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#enemyEventsInPrepGrid = enemyEventsInPrepGrid;
    this.#mouseInput = mouseInput;
    this.#executeBy = executeBy;
    this.#stateMessages = stateMessages;
    this.#eventsData = eventsData;
  }

  execute() {
    let message = new StateMessage(
      "DARKNESS FALLS... ANGELO TAKES CONTROL",
      "40px MedievalSharp",
      "blue",
      2,
      1200,
      520
    );
    this.#stateMessages.push(message);
    this.#eventsData.activeVisibilitySkill = this;
  }

  restore() {
    let message = new StateMessage(
      "THE DARKNESS FADES... ANGELO RECEDES INTO THE SHADOWS",
      "35px MedievalSharp",
      "red",
      2,
      1200,
      520
    );
    this.#stateMessages.push(message);
    this.#eventsData.activeVisibilitySkill = null;
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
