import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import AttackEvent from "../Events/AttackEvent.js";
import globals from "../Game/globals.js";
import {
  PlayerID,
  CardState,
  DeckType,
  GridType,
  AttackPhaseState,
  WeaponTypeID,
  AttackMenuBtn,
  MinionTypeID,
  ArmorID,
} from "../Game/constants.js";

export default class AttackPhase extends Phase {
  #enemyMovementGrid;
  #currentPlayerMovementGrid;
  #enemyMovementGridDeck;
  #enemyMinionsDeck;
  #currentPlayerMovementGridDeck;
  #currentPlayerMinionsDeck;
  #isParryChosen;
  #isArmorPowerChosen;
  #eventDeck;
  #stateMessages;
  #player;
  #attackMenuData;
  #eventsData;

  constructor(
    state,
    mouseInput,
    phaseMessage,
    enemyMovementGrid,
    currentPlayerMovementGrid,
    enemyMovementGridDeck,
    enemyMinionsDeck,
    currentPlayerMovementGridDeck,
    currentPlayerMinionsDeck,
    eventDeck,
    stateMessages,
    player,
    attackMenuData,
    eventsData
  ) {
    super(state, mouseInput, phaseMessage);

    this.#enemyMovementGrid = enemyMovementGrid;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    this.#enemyMovementGridDeck = enemyMovementGridDeck;
    this.#enemyMinionsDeck = enemyMinionsDeck;
    this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
    this.#currentPlayerMinionsDeck = currentPlayerMinionsDeck;
    this.#isParryChosen = false;
    this.#isArmorPowerChosen = false;
    this.#eventDeck = eventDeck;
    this.#stateMessages = stateMessages;
    this.#player = player;
    this.#attackMenuData = attackMenuData;
    this.#eventsData = eventsData;
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer,
    phaseMessage,
    stateMessages,
    attackMenuData,
    eventsData
  ) {
    let enemyMovementGrid;
    let currentPlayerMovementGrid;

    if (player === currentPlayer) {
      currentPlayerMovementGrid =
        board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];

      enemyMovementGrid = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    } else {
      currentPlayerMovementGrid =
        board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];

      enemyMovementGrid = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    }

    let enemyMovementGridDeck;
    let enemyMinionsDeck;
    let currentPlayerMovementGridDeck;
    let currentPlayerMinionsDeck;

    if (player.getID() === PlayerID.PLAYER_1) {
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      currentPlayerMinionsDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];

      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      enemyMinionsDeck = deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];
    } else {
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      currentPlayerMinionsDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];

      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      enemyMinionsDeck = deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];
    }

    const eventDeck = deckContainer.getDecks()[DeckType.EVENTS];

    const attackPhase = new AttackPhase(
      AttackPhaseState.INIT,
      mouseInput,
      phaseMessage,
      enemyMovementGrid,
      currentPlayerMovementGrid,
      enemyMovementGridDeck,
      enemyMinionsDeck,
      currentPlayerMovementGridDeck,
      currentPlayerMinionsDeck,
      eventDeck,
      stateMessages,
      player,
      attackMenuData,
      eventsData
    );

    return attackPhase;
  }

  execute() {
    let isPhaseFinished = false;

    switch (this._state) {
      // PHASE INITIALIZATION
      case AttackPhaseState.INIT:
        this.#initializePhase();
        break;

      // ATTACKER SELECTION
      case AttackPhaseState.SELECT_ATTACKER:
        this.#selectAttacker();
        break;

      // TARGET SELECTION
      case AttackPhaseState.SELECT_TARGET:
        this.#selectTarget();
        break;

      // ATTACK MENU
      case AttackPhaseState.ATTACK_MENU:
        this.#checkWhichBtnIsPressed();
        break;

      // CALCULATION AND APPLICATION OF DAMAGE
      case AttackPhaseState.CALC_AND_APPLY_DMG:
        this.#calcAndApplyDmg();
        break;

      // PHASE END
      case AttackPhaseState.END:
        this.#finalizePhase();
        isPhaseFinished = true;
        break;
    }

    return isPhaseFinished;
  }

  #initializePhase() {
    this.#resetRelevantCardsStates([
      this.#enemyMovementGridDeck,
      this.#currentPlayerMovementGridDeck,
    ]);

    this._state = AttackPhaseState.SELECT_ATTACKER;
  }

  #resetRelevantCardsStates(decks) {
    for (let i = 0; i < decks.length; i++) {
      const currentDeck = decks[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];
        currentCard.setState(CardState.PLACED);
      }
    }
  }

  #selectAttacker() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.attack.selectAttacker[globals.language]
    );

    const attacker = this.#currentPlayerMovementGridDeck.lookForHoveredCard();

    if (attacker) {
      if (!attacker.isLeftClicked()) {
        attacker.setState(CardState.HOVERED);
      } else {
        attacker.setState(CardState.SELECTED);

        this._state = AttackPhaseState.SELECT_TARGET;
      }
    }
  }

  #selectTarget() {
    this._phaseMessage.setCurrentContent(
      PhaseMessage.content.attack.selectTarget[globals.language]
    );

    const attacker = this.#currentPlayerMovementGridDeck.lookForSelectedCard();

    if (attacker.isLeftClicked()) {
      // THE PREVIOUSLY SELECTED ATTACKER WAS DESELECTED
      attacker.setState(CardState.PLACED);

      this._state = AttackPhaseState.SELECT_ATTACKER;
    } else {
      const target = this.#enemyMovementGridDeck.lookForHoveredCard();

      if (target) {
        const attackerBox = attacker.getBoxIsPositionedIn(
          this.#currentPlayerMovementGrid,
          attacker
        );
        const targetBox = target.getBoxIsPositionedIn(
          this.#enemyMovementGrid,
          target
        );

        let isTargetWithinReach = this.#checkIfTargetIsWithinReach(
          attacker,
          attackerBox,
          targetBox
        );

        if (isTargetWithinReach) {
          if (!target.isLeftClicked()) {
            target.setState(CardState.HOVERED);
          } else {
            target.setState(CardState.SELECTED);

            if (target.getWeapon()) {
              this.#attackMenuData.btns[
                AttackMenuBtn.BLOCK_ATTACK
              ].isActive = true;
            } else {
              this.#attackMenuData.btns[
                AttackMenuBtn.BLOCK_ATTACK
              ].isActive = false;
            }

            let canArmorPowerBeUsed = false;
            if (target.getArmor()) {
              canArmorPowerBeUsed = this.#checkIfArmorPowerCanBeUsed(target);
            }

            if (canArmorPowerBeUsed) {
              this.#attackMenuData.btns[
                AttackMenuBtn.ARMOR_POWER
              ].isActive = true;
            } else {
              this.#attackMenuData.btns[
                AttackMenuBtn.ARMOR_POWER
              ].isActive = false;
            }

            if (target.getWeapon() || canArmorPowerBeUsed) {
              this.#attackMenuData.isOpen = true;

              this._state = AttackPhaseState.ATTACK_MENU;
            } else {
              this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
            }
          }
        } else {
          this._phaseMessage.setCurrentContent(
            PhaseMessage.content.attack.targetOutOfLimit[globals.language]
          );
        }
      }
    }
  }

  #checkIfTargetIsWithinReach(attacker, attackerBox, targetBox) {
    let isTargetWithinReach = false;

    if (
      !attacker.getWeapon() ||
      attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE
    ) {
      const targetMinXCoordinate =
        attackerBox.getXCoordinate() - 135 - attackerBox.getWidth();
      const targetMaxXCoordinate =
        attackerBox.getXCoordinate() + 135 + attackerBox.getWidth();

      let isYCoordinateLimitExceeded = true;
      if (
        this.#currentPlayerMovementGrid.getGridType() ===
        GridType.PLAYER_1_BATTLEFIELD
      ) {
        const targetMinYCoordinate =
          attackerBox.getYCoordinate() - 135 - attackerBox.getHeight();

        if (targetBox.getYCoordinate() >= targetMinYCoordinate) {
          isYCoordinateLimitExceeded = false;
        }
      } else {
        const targetMaxYCoordinate =
          attackerBox.getYCoordinate() + 135 + attackerBox.getHeight();

        if (targetBox.getYCoordinate() <= targetMaxYCoordinate) {
          isYCoordinateLimitExceeded = false;
        }
      }

      if (
        targetBox.getXCoordinate() >= targetMinXCoordinate &&
        targetBox.getXCoordinate() <= targetMaxXCoordinate &&
        !isYCoordinateLimitExceeded
      ) {
        isTargetWithinReach = true;
      }
    } else if (
      !attacker.getWeapon() ||
      attacker.getMinionWeaponTypeID() === WeaponTypeID.MISSILE
    ) {
      let isYCoordinateLimitExceeded = false;
      let isXCoordinateLimitExceeded = false;
      if (
        this.#currentPlayerMovementGrid.getGridType() ===
        GridType.PLAYER_1_BATTLEFIELD
      ) {
        const targetMinYCoordinate =
          attackerBox.getYCoordinate() - 135 - attackerBox.getHeight();

        if (targetBox.getYCoordinate() >= targetMinYCoordinate) {
          isYCoordinateLimitExceeded = true;
        }

        const targetMinXCoordinate = attackerBox.getXCoordinate() - 135;
        const targetMaxXCoordinate =
          attackerBox.getXCoordinate() + 135 + attackerBox.getWidth();

        if (
          targetBox.getXCoordinate() >= targetMinXCoordinate &&
          targetBox.getXCoordinate() <= targetMaxXCoordinate
        ) {
          isXCoordinateLimitExceeded = true;
        }
      } else {
        const targetMaxYCoordinate =
          attackerBox.getYCoordinate() + 135 + attackerBox.getHeight();

        if (targetBox.getYCoordinate() <= targetMaxYCoordinate) {
          isYCoordinateLimitExceeded = true;
        }

        const targetMinXCoordinate = attackerBox.getXCoordinate() - 135;
        const targetMaxXCoordinate =
          attackerBox.getXCoordinate() + 135 + attackerBox.getWidth();

        if (
          targetBox.getXCoordinate() >= targetMinXCoordinate &&
          targetBox.getXCoordinate() <= targetMaxXCoordinate
        ) {
          isXCoordinateLimitExceeded = true;
        }
      }

      if (isXCoordinateLimitExceeded && isYCoordinateLimitExceeded) {
        isTargetWithinReach = false;
      } else {
        isTargetWithinReach = true;
      }
    } else if (
      !attacker.getWeapon() ||
      attacker.getMinionWeaponTypeID() === WeaponTypeID.HYBRID
    ) {
      isTargetWithinReach = true;
    }

    return isTargetWithinReach;
  }

  #checkIfArmorPowerCanBeUsed(target) {
    let canArmorPowerBeUsed = false;

    const isWarriorAndHasBreastplatePrimordialColossus =
      target.getMinionTypeID() === MinionTypeID.WARRIOR &&
      target.getArmorID() === ArmorID.BREASTPLATE_PRIMORDIAL_COLOSSUS;

    const isWizardAndHasCloakEternalShadow =
      target.getMinionTypeID() === MinionTypeID.WIZARD &&
      target.getArmorID() === ArmorID.CLOAK_ETERNAL_SHADOW;

    if (isWarriorAndHasBreastplatePrimordialColossus) {
      canArmorPowerBeUsed = true;
    } else if (isWizardAndHasCloakEternalShadow) {
      const attacker =
        this.#currentPlayerMovementGridDeck.lookForSelectedCard();
      const attackerHasMeleeWeapon =
        attacker.getWeapon() &&
        attacker.getMinionWeaponTypeID() === WeaponTypeID.MELEE;

      canArmorPowerBeUsed = attackerHasMeleeWeapon;
    }

    return canArmorPowerBeUsed;
  }

  #checkWhichBtnIsPressed() {
    const { blockAttack, armorPower, pass } = this.#checkIfAnyBtnIsPressed();

    if (blockAttack || armorPower || pass) {
      this._state = AttackPhaseState.CALC_AND_APPLY_DMG;

      if (blockAttack) {
        this.#isParryChosen = true;
      } else if (armorPower) {
        this.#isArmorPowerChosen = true;
      }
    }
  }

  #checkIfAnyBtnIsPressed() {
    const isBtnPressed = {
      blockAttack: false,
      armorPower: false,
      pass: false,
    };

    if (this._mouseInput.isLeftButtonPressed()) {
      const mouseX = this._mouseInput.getMouseXCoordinate();
      const mouseY = this._mouseInput.getMouseYCoordinate();

      for (let i = 0; i < this.#attackMenuData.btns.length; i++) {
        const currentBtn = this.#attackMenuData.btns[i];

        if (
          currentBtn.isActive &&
          mouseX >= this.#attackMenuData.btnsXCoordinate &&
          mouseX <=
            this.#attackMenuData.btnsXCoordinate +
              this.#attackMenuData.btnsWidth &&
          mouseY >= currentBtn.yCoordinate &&
          mouseY <= currentBtn.yCoordinate + this.#attackMenuData.btnsHeight
        ) {
          if (
            currentBtn.text ===
            this.#attackMenuData.btns[AttackMenuBtn.BLOCK_ATTACK].text
          ) {
            isBtnPressed.blockAttack = true;
          } else if (
            currentBtn.text ===
            this.#attackMenuData.btns[AttackMenuBtn.ARMOR_POWER].text
          ) {
            isBtnPressed.armorPower = true;
          } else {
            isBtnPressed.pass = true;
          }

          this.#attackMenuData.isOpen = false;
        }
      }
    }

    return isBtnPressed;
  }

  #calcAndApplyDmg() {
    const attacker = this.#currentPlayerMovementGridDeck.lookForSelectedCard();
    const target = this.#enemyMovementGridDeck.lookForSelectedCard();

    const attackEvent = new AttackEvent(
      attacker,
      target,
      this.#currentPlayerMovementGrid,
      this.#enemyMovementGrid,
      this.#isParryChosen,
      this.#isArmorPowerChosen,
      this.#eventDeck,
      this.#stateMessages,
      this.#player,
      this.#eventsData
    );
    attackEvent.execute();

    this._state = AttackPhaseState.END;
  }

  #finalizePhase() {
    this.#updateDecksAndGrids([
      this.#enemyMovementGridDeck,
      this.#currentPlayerMovementGridDeck,
    ]);

    this.#isParryChosen = false;
    this.#isArmorPowerChosen = false;

    this._state = AttackPhaseState.INIT;
  }

  #updateDecksAndGrids(decksToCheck) {
    for (let i = 0; i < decksToCheck.length; i++) {
      const currentDeck = decksToCheck[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        if (currentCard.getCurrentHP() === 0) {
          currentDeck.removeCard(currentCard);

          // MAKE THE BOX THE NOW DEAD MINION WAS POSITIONED IN AVAILABLE

          let gridWhereToLookForBox;
          let movementGridDeckToInsertCardInto;
          let minionsDeckToDrawCardFrom;

          if (currentDeck === this.#currentPlayerMovementGridDeck) {
            gridWhereToLookForBox = this.#currentPlayerMovementGrid;
            movementGridDeckToInsertCardInto =
              this.#currentPlayerMovementGridDeck;
            minionsDeckToDrawCardFrom = this.#currentPlayerMinionsDeck;
          } else {
            gridWhereToLookForBox = this.#enemyMovementGrid;
            movementGridDeckToInsertCardInto = this.#enemyMovementGridDeck;
            minionsDeckToDrawCardFrom = this.#enemyMinionsDeck;
          }

          const currentCardBox = currentCard.getBoxIsPositionedIn(
            gridWhereToLookForBox,
            currentCard
          );
          currentCardBox.resetCard();

          // REPLACE THE DEAD MINION BY A NEW ONE DRAWN FROM THE CORRESPONDING PLAYER'S MINIONS DECK

          const newMinion = minionsDeckToDrawCardFrom.getCards()[0];

          if (newMinion) {
            movementGridDeckToInsertCardInto.insertCard(newMinion);

            minionsDeckToDrawCardFrom.removeCard(newMinion);

            this.#positionNewMinion(newMinion, gridWhereToLookForBox);
          }
        }
      }
    }
  }

  #positionNewMinion(newMinion, gridToPositionNewMinionIn) {
    for (let i = 0; i < gridToPositionNewMinionIn.getBoxes().length; i++) {
      const currentBox = gridToPositionNewMinionIn.getBoxes()[i];

      if (!currentBox.isOccupied()) {
        currentBox.setCard(newMinion);

        newMinion.setXCoordinate(currentBox.getXCoordinate());
        newMinion.setYCoordinate(currentBox.getYCoordinate());

        break;
      }
    }
  }

  reset() {
    this._state = AttackPhaseState.INIT;
  }
}
