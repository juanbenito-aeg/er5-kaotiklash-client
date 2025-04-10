import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import LucretiaSpecialSkill from "./LucretiaSpecialSkill.js";
import SpecialSkillDecrepitThrone from "./SpecialSkillDecrepitThrone.js";
import { MainCharacterID } from "../Game/constants.js";
import { globals } from "../index.js";

export default class SummonCharacterEvent extends Event {
  #mainCharacterID;
  #specialSkill;
  // #currentPlayer;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyBattleFieldGrid;
  #enemyMinionsInPlayDeck;
  #isFinished;
  #enemyBattlefieldGrid;
  #lucretiaDeers;

  constructor(
    executedBy,
    eventCard,
    // currentPlayer,
    currentPlayerMainCharacterDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerEventsInPrepDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyBattleFieldGrid,
    enemyMinionsInPlayDeck,
    lucretiaDeers
  ) {
    super(executedBy, eventCard);

    this.#mainCharacterID = currentPlayerMainCharacterDeck
      .getCards()[0]
      .getID();
    // this.#currentPlayer = currentPlayer;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyBattleFieldGrid = enemyBattleFieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#lucretiaDeers = lucretiaDeers;
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
        // HERE A SPECIAL SKILL INSTANCE IS CREATED
        break;

      case MainCharacterID.THE_DECREPIT_THRONE:
        const decrepitThroneSkill = new SpecialSkillDecrepitThrone(
          this.#enemyBattleFieldGrid
          // this.#currentPlayer
        );

        if (!this.#isFinished) {
          decrepitThroneSkill.execute();
          this.#isFinished = true;
        }

        if (!this.isActive()) {
          decrepitThroneSkill.restore();
        }
        break;
    }
  }
}
