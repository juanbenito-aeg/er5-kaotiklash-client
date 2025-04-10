import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import LucretiaSpecialSkill from "./LucretiaSpecialSkill.js";
import { MainCharacterID } from "../Game/constants.js";
import SpecialSkillAngelo from "./SpecialSkillAngelo.js";
import { globals } from "../index.js";

export default class SummonCharacterEvent extends Event {
  #mainCharacterID;
  #specialSkill;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyBattleFieldGrid;
  #enemyEventsInPrepGrid;
  #enemyMinionsInPlayDeck;
  #mouseInput;
  #isFinished;
  #enemyBattlefieldGrid;
  #lucretiaDeers;
  #stateMessages;

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
    enemyBattleFieldGrid,
    enemyMinionsInPlayDeck,
    mouseInput,
    lucretiaDeers,
    stateMessages
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
    this.#enemyBattleFieldGrid = enemyBattleFieldGrid;
    this.#enemyEventsInPrepGrid = enemyEventsInPrepGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#mouseInput = mouseInput;
    this.#isFinished = false;
    this.#lucretiaDeers = lucretiaDeers;
    this.#stateMessages = stateMessages;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    switch (this.#mainCharacterID) {
      case MainCharacterID.THE_ERUDITE_XG:
        if (!this.#specialSkill) {
          const xgSkill = new SpecialSkillXG(
            this.#currentPlayerMinionsInPlayDeck
          );

          this.#specialSkill = xgSkill;

          this.#specialSkill.execute();
        }

        if (!this.isActive()) {
          this.#specialSkill.restoreMinionStats();

          globals.isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;

      case MainCharacterID.LUCRETIA:
        if (!this.#specialSkill) {
          const lucretiaSpecialSkill = new LucretiaSpecialSkill(
            this.#lucretiaDeers,
            this.#enemyMinionsInPlayDeck,
            this.#enemyBattlefieldGrid
          );

          this.#specialSkill = lucretiaSpecialSkill;

          this.#specialSkill.execute();
        }

        if (!this.isActive()) {
          this.#specialSkill.undoTransformation();

          globals.isPlayersSummonCharacterActive[
            this._executedBy.getID()
          ] = false;
        }

        break;

      case MainCharacterID.ANGELO_DI_MORTIS:
        const angeloSkill = new SpecialSkillAngelo(
          this.#enemyBattleFieldGrid,
          this.#enemyEventsInPrepGrid,
          this.#mouseInput,
          currentPlayer,
          this.#stateMessages
        );

        if (!this.#isFinished) {
          angeloSkill.execute();
          this.#isFinished = true;
        }

        if (!this.isActive()) {
          angeloSkill.restore();
        }
        break;
    }
  }
}
