import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import { MainCharacterID } from "../Game/constants.js";

export default class SummonCharacterEvent extends Event {
  #currentPlayerMainCharacterDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyMinionsInPlayDeck;
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
    enemyMinionsInPlayDeck
  ) {
    super(executedBy, eventCard);

    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
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
        //HERE A SPECIAL SKILL INSTANCE IS CREATED
        break;

      case MainCharacterID.ANGELO_DI_MORTIS:
        //HERE A SPECIAL SKILL INSTANCE IS CREATED
        break;
    }
  }
}
