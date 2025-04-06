import Event from "./Event.js";
import SpecialSkill_XG from "./SpecialSkillXG.js";
import { MainCharacterID } from "../Game/constants.js";

export default class SummonCharacterEvent extends Event {
  #currentPlayerMainCharacterDeck;
  #currentPlayerCardsInHandDeck;
  #currentPlayerEventsInPrepDeck;
  #currentPlayerMinionsInPlayDeck;
  #currentPlayerEventsInPrepGrid;
  #currentPlayerBattlefieldGrid;
  #enemyMinionsInPlayDeck;

  constructor(
    currentPlayerMainCharacterDeck,
    currentPlayerCardsInHandDeck,
    currentPlayerEventsInPrepDeck,
    currentPlayerMinionsInPlayDeck,
    currentPlayerEventsInPrepGrid,
    currentPlayerBattlefieldGrid,
    enemyMinionsInPlayDeck
  ) {
    super();

    this.#currentPlayerMainCharacterDeck = currentPlayerMainCharacterDeck;
    this.#currentPlayerCardsInHandDeck = currentPlayerCardsInHandDeck;
    this.#currentPlayerEventsInPrepDeck = currentPlayerEventsInPrepDeck;
    this.#currentPlayerMinionsInPlayDeck = currentPlayerMinionsInPlayDeck;
    this.#currentPlayerEventsInPrepGrid = currentPlayerEventsInPrepGrid;
    this.#currentPlayerBattlefieldGrid = currentPlayerBattlefieldGrid;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
  }

  execute() {
    const mainCharacterDeck = this.#currentPlayerMainCharacterDeck;
    const mainCharacterCard = mainCharacterDeck.getCards()[0];
    const mainCharacterID = mainCharacterCard.getID();

    switch (mainCharacterID) {
      case MainCharacterID.THE_ERUDITE_XG:
        const xgSkill = new SpecialSkill_XG(
          this.#currentPlayerMinionsInPlayDeck
        );
        xgSkill.execute();
        break;
    }
  }
}
