export default class LucretiaSpecialSkill {
  #lucretiaDeers;
  #enemyMinionsInPlayDeck;
  #enemyMinionsInPlayGrid;
  #minionsBeforeTransformation;

  constructor(lucretiaDeers, enemyMinionsInPlayDeck, enemyMinionsInPlayGrid) {
    this.#lucretiaDeers = lucretiaDeers;
    this.#enemyMinionsInPlayDeck = enemyMinionsInPlayDeck;
    this.#enemyMinionsInPlayGrid = enemyMinionsInPlayGrid;
    this.#minionsBeforeTransformation = [];
  }

  execute() {
    for (let i = 0; i < this.#enemyMinionsInPlayDeck.getCards().length; i++) {
      const currentNormalMinion = this.#enemyMinionsInPlayDeck.getCards()[i];
      const currentDeer = this.#lucretiaDeers.getCards()[i];

      const boxNormalMinionIsPositionedIn =
        currentNormalMinion.getBoxIsPositionedIn(
          this.#enemyMinionsInPlayGrid,
          currentNormalMinion
        );

      // POSITION THE DEER IN THE SAME BOX AS THE NORMAL MINION
      boxNormalMinionIsPositionedIn.resetCard();
      boxNormalMinionIsPositionedIn.setCard(currentDeer);
      currentDeer.setXCoordinate(
        boxNormalMinionIsPositionedIn.getXCoordinate()
      );
      currentDeer.setYCoordinate(
        boxNormalMinionIsPositionedIn.getYCoordinate()
      );

      // STORE THE NORMAL MINION IN ANOTHER ARRAY BEFORE BEING REMOVED FROM THE "MINIONS IN PLAY" DECK
      this.#minionsBeforeTransformation.push(currentNormalMinion);

      this.#enemyMinionsInPlayDeck.replaceCard(
        currentNormalMinion,
        currentDeer
      );
    }
  }
}
