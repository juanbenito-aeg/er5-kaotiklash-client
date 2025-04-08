import Event from "./Event.js";
import SpecialSkillXG from "./SpecialSkillXG.js";
import { MainCharacterID } from "../Game/constants.js";
import SpecialSkillAngelo from "./SpecialSkillAngelo.js";

export default class SummonCharacterEvent extends Event {
  #currentPlayerMainCharacterDeck;
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
    mouseInput
  ) {
    super(executedBy, eventCard);

    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
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
        const angeloSkill = new SpecialSkillAngelo(
          this.#currentPlayerBattlefieldGrid,
          this.#currentPlayerEventsInPrepGrid,
          this.#enemyBattleFieldGrid,
          this.#enemyEventsInPrepGrid,
          this.#mouseInput,
          this._executedBy
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
