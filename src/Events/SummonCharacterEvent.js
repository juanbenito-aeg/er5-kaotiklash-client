import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import LucretiaSpecialSkill from "./LucretiaSpecialSkill.js";
import { MainCharacterID } from "../Game/constants.js";

export default class SummonCharacterEvent extends Event {
  #currentPlayerMainCharacterDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyMinionsInPlayDeck;
  #enemyBattlefieldGrid;
  #lucretiaDeers;
  #isFinished;

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

    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#enemyBattlefieldGrid = enemyBattlefieldGrid;
    this.#lucretiaDeers = lucretiaDeers;
    this.#isFinished = false;
  }

  execute(currentPlayer) {
    this.reduceDuration(currentPlayer);

    const mainCharacterDeck = this.#currentPlayerMainCharacterDeck;
    const mainCharacterCard = mainCharacterDeck.getCards()[0];
    const mainCharacterID = mainCharacterCard.getID();

    switch (mainCharacterID) {
      case MainCharacterID.THE_ERUDITE_XG:
        const xgSkill = new SpecialSkillXG(
          this.#currentPlayerMinionsInPlayDeck
        );

        if (!this.#isFinished) {
          xgSkill.execute();
          this.#isFinished = true;
        }

        if (!this.isActive()) {
          xgSkill.restoreMinionStats();
        }

        break;

      case MainCharacterID.LUCRETIA:
        const lucretiaSpecialSkill = new LucretiaSpecialSkill(
          this.#lucretiaDeers,
          this.#enemyMinionsInPlayDeck,
          this.#enemyBattlefieldGrid
        );

        if (!this.#isFinished) {
          lucretiaSpecialSkill.execute();
          this.#isFinished = true;
        }

        break;

      case MainCharacterID.ANGELO_DI_MORTIS:
        // HERE A SPECIAL SKILL INSTANCE IS CREATED
        break;
    }
  }
}
