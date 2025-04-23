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

  undoTransformation() {
    for (let i = 0; i < this.#lucretiaDeers.getCards().length; i++) {
      const currentDeer = this.#lucretiaDeers.getCards()[i];

      if (currentDeer.getCurrentHP() > 0) {
        const currentNormalMinion = this.#minionsBeforeTransformation[i];

        const boxDeerIsPositionedIn = currentDeer.getBoxIsPositionedIn(
          this.#enemyMinionsInPlayGrid,
          currentDeer
        );

        // POSITION THE NORMAL MINION IN THE SAME BOX AS THE DEER
        boxDeerIsPositionedIn.resetCard();
        boxDeerIsPositionedIn.setCard(currentNormalMinion);
        currentNormalMinion.setXCoordinate(
          boxDeerIsPositionedIn.getXCoordinate()
        );
        currentNormalMinion.setYCoordinate(
          boxDeerIsPositionedIn.getYCoordinate()
        );

        this.#enemyMinionsInPlayDeck.replaceCard(
          currentDeer,
          currentNormalMinion
        );
      }
    }

    this.#resetDeerAttributes();
  }

  #resetDeerAttributes() {
    for (let i = 0; i < this.#lucretiaDeers.getCards().length; i++) {
      const currentDeer = this.#lucretiaDeers.getCards()[i];

      currentDeer.setCurrentHP(currentDeer.getInitialHP());
      currentDeer.setCurrentMadness(currentDeer.getInitialMadness());
      currentDeer.setCurrentStrength(currentDeer.getInitialStrength());
      currentDeer.setCurrentAttack(currentDeer.getInitialAttack());
      currentDeer.setCurrentConstitution(currentDeer.getInitialConstitution());
      currentDeer.setCurrentDefense(currentDeer.getInitialDefense());
    }
  }
}
