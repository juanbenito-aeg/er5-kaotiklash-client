import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import LucretiaSpecialSkill from "./LucretiaSpecialSkill.js";
import { MainCharacterID } from "../Game/constants.js";

export default class SummonCharacterEvent extends Event {
  #mainCharacterID;
  #specialSkill;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyMinionsInPlayDeck;
  #enemyBattlefieldGrid;
  #lucretiaDeers;

  constructor(
    executedBy,
    eventCard,
    currentPlayerMainCharacterDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerEventsInPrepDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyMinionsInPlayDeck,
    enemyBattlefieldGrid,
    lucretiaDeers
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
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
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
        }

        break;

      case MainCharacterID.ANGELO_DI_MORTIS:
        // HERE A SPECIAL SKILL INSTANCE IS CREATED
        break;
    }
  }
}
