import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import LucretiaSpecialSkill from "./LucretiaSpecialSkill.js";
import SpecialSkillDecrepitThrone from "./SpecialSkillDecrepitThrone.js";
import SpecialSkillAngelo from "./SpecialSkillAngelo.js";
import StateMessage from "../Messages/StateMessage.js";
import globals from "../Game/globals.js";
import { MainCharacterID } from "../Game/constants.js";
import Physics from "../Game/Physics.js";

export default class SummonCharacterEvent extends Event {
  #mainCharacterID;
  #specialSkill;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyBattlefieldGrid;
  #enemyEventsInPrepGrid;
  #enemyMinionsInPlayDeck;
  #mouseInput;
  #isFinished;
  #lucretiaDeers;
  #stateMessages;
  #isPlayersSummonCharacterActive;
  #eventsData;

  constructor(
    executedBy,
    eventCard,
    currentPlayerMainCharacterDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerEventsInPrepDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyEventsInPrepGrid,
    enemyBattlefieldGrid,
    enemyMinionsInPlayDeck,
    mouseInput,
    lucretiaDeers,
    stateMessages,
    isPlayersSummonCharacterActive,
    eventsData
  ) {
    super(executedBy, eventCard);

    this.#mainCharacterID = currentPlayerMainCharacterDeck
      .getCards()[0]
      .getID();
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyEventsInPrepGrid = enemyEventsInPrepGrid;
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#mouseInput = mouseInput;
    this.#isFinished = false;
    this.#lucretiaDeers = lucretiaDeers;
    this.#stateMessages = stateMessages;
    this.#isPlayersSummonCharacterActive = isPlayersSummonCharacterActive;
    this.#eventsData = eventsData;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    switch (this.#mainCharacterID) {
      case MainCharacterID.THE_ERUDITE_XG:
        if (!this.#specialSkill) {
          const xgSkill = new SpecialSkillXG(
            this.#currentPlayerMinionsInPlayDeck,
            this.#stateMessages
          );

          this.#specialSkill = xgSkill;

          this.#specialSkill.execute();
        }

        if (!this.isActive()) {
          this.#specialSkill.restoreMinionStats();

          this.#isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;

      case MainCharacterID.LUCRETIA:
        if (!this.#specialSkill) {
          const lucretiaSpecialSkill = new LucretiaSpecialSkill(
            this.#lucretiaDeers,
            this.#enemyMinionsInPlayDeck,
            this.#enemyBattlefieldGrid,
            this.#stateMessages
          );

          this.#specialSkill = lucretiaSpecialSkill;

          this.#specialSkill.execute();
        }

        if (!this.isActive()) {
          this.#specialSkill.undoTransformation();

          this.#isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;

      case MainCharacterID.ANGELO_DI_MORTIS:
        if (!this.#specialSkill) {
          const angeloSkill = new SpecialSkillAngelo(
            this.#enemyBattlefieldGrid,
            this.#enemyEventsInPrepGrid,
            this.#mouseInput,
            currentPlayer,
            this.#stateMessages,
            this.#eventsData
          );

          this.#specialSkill = angeloSkill;

          this.#specialSkill.execute();
        }

        if (!this.isActive()) {
          this.#specialSkill.restore();

          this.#isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;

      case MainCharacterID.THE_DECREPIT_THRONE:
        if (!this.#specialSkill) {
          const decrepitThroneSkill = new SpecialSkillDecrepitThrone(
            this.#enemyBattlefieldGrid,
            this._executedBy,
            this.#eventsData,
            this.#stateMessages
          );

          this.#specialSkill = decrepitThroneSkill;

          this.#specialSkill.execute();
        }

        if (this.#eventsData.decrepitThroneSkill.turnsSinceActivation === 5) {
          // INCREMENT "turnsSinceActivation" TO STOP THE EFFECT FROM BEING APPLIED MANY MORE TIMES
          this.#eventsData.decrepitThroneSkill.turnsSinceActivation++;

          this.#specialSkill.applyEffect();

          const secondMinionsAttractionMsg = new StateMessage(
            "ENEMY MINIONS WERE ATTRACTED TO THE FRONT COMBAT AREA ONE LAST TIME...",
            "30px MedievalSharp",
            "red",
            1,
            2,
            globals.canvas.width / 2,
            globals.canvas.height / 2,
            1,
            new Physics(0, 0)
          );

          secondMinionsAttractionMsg.setVY(20);

          this.#stateMessages.push(secondMinionsAttractionMsg);
        }

        if (!this.isActive()) {
          this.#specialSkill.resetRelatedVariables();

          const curseDisappearanceMsg = new StateMessage(
            "THE CURSE OF THE THRONE VANISHED, AT LEAST FOR NOW...",
            "30px MedievalSharp",
            "red",
            1,
            2,
            globals.canvas.width / 2,
            globals.canvas.height / 2,
            1,
            new Physics(0, 0)
          );

          curseDisappearanceMsg.setVY(20);

          this.#stateMessages.push(curseDisappearanceMsg);

          this.#isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;
    }
  }
}
