import Phase from "./Phase.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import AttackEvent from "../Events/AttackEvent.js";
import {
  PlayerID,
  CardState,
  DeckType,
  GridType,
  AttackPhaseState,
  WeaponTypeID,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class AttackPhase extends Phase {
  #enemyMovementGrid;
  #currentPlayerMovementGrid;
  #enemyMovementGridDeck;
  #enemyMinionsDeck;
  #currentPlayerMovementGridDeck;
  #currentPlayerMinionsDeck;
  #parry;
  #eventDeck;

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
    eventDeck
  ) {
    super(state, mouseInput, phaseMessage);

    this.#enemyMovementGrid = enemyMovementGrid;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
    this.#enemyMovementGridDeck = enemyMovementGridDeck;
    this.#enemyMinionsDeck = enemyMinionsDeck;
    this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
    this.#currentPlayerMinionsDeck = currentPlayerMinionsDeck;
    this.#parry = false;
    this.#eventDeck = eventDeck;
  }

  static create(
    player,
    deckContainer,
    board,
    mouseInput,
    events,
    currentPlayer,
    phaseMessage
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
      eventDeck
    );

    return attackPhase;
  }

  execute() {
    let isPhaseFinished = false;

    let attacker;
    let target;
    switch (this._state) {
      // PHASE INITIALIZATION
      case AttackPhaseState.INIT:
        console.log("INIT");

        this.#resetRelevantCardsStates([
          this.#enemyMovementGridDeck,
          this.#currentPlayerMovementGridDeck,
        ]);

        this._state = AttackPhaseState.SELECT_ATTACKER;

        break;

      // ATTACKER SELECTION
      case AttackPhaseState.SELECT_ATTACKER:
        console.log("ATTACKER SELECTION");

        this._phaseMessage.setCurrentContent(
          PhaseMessage.content.attack.selectAttacker[globals.language]
        );

        attacker = this.#currentPlayerMovementGridDeck.lookForHoveredCard();

        if (attacker) {
          if (!attacker.isLeftClicked()) {
            attacker.setState(CardState.HOVERED);
          } else {
            console.log("ATTACKER SELECTED");

            attacker.setState(CardState.SELECTED);

            this._state = AttackPhaseState.SELECT_TARGET;
          }
        }

        break;

      // TARGET SELECTION
      case AttackPhaseState.SELECT_TARGET:
        console.log("TARGET SELECTION");

        this._phaseMessage.setCurrentContent(
          PhaseMessage.content.attack.selectTarget[globals.language]
        );

        attacker = this.#currentPlayerMovementGridDeck.lookForSelectedCard();

        if (attacker.isLeftClicked()) {
          console.log("ATTACKER DESELECTED");

          // THE PREVIOUSLY SELECTED ATTACKER WAS DESELECTED
          attacker.setState(CardState.PLACED);
          this._state = AttackPhaseState.SELECT_ATTACKER;
        } else {
          target = this.#enemyMovementGridDeck.lookForHoveredCard();
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
                if (target.getWeapon() !== null) {
                  globals.isParryMenuOpen = true;
                  this._state = AttackPhaseState.PARRY_SELECION;
                } else {
                  this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
                }
              }
            }
          }
        }

        break;

      // PARRY SELECTION
      case AttackPhaseState.PARRY_SELECION:
        console.log("PARRY SELECTION");

        let isParryActivated = this.#isMouseOnButtons();
        if (isParryActivated) {
          this.#parry = true;
          this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
        } else if (isParryActivated === false) {
          this.#parry = false;
          this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
        }

        break;

      // CALCULATION AND APPLICATION OF DAMAGE
      case AttackPhaseState.CALC_AND_APPLY_DMG:
        console.log("CALC. & APPLICATION OF DMG");

        attacker = this.#currentPlayerMovementGridDeck.lookForSelectedCard();
        target = this.#enemyMovementGridDeck.lookForSelectedCard();
        const attackEvent = AttackEvent.create(
          attacker,
          target,
          this.#currentPlayerMovementGrid,
          this.#enemyMovementGrid,
          this.#parry,
          this.#eventDeck
        );
        attackEvent.execute();

        this._state = AttackPhaseState.END;

        break;

      // PHASE END
      case AttackPhaseState.END:
        console.log("END");

        this.#updateDecksAndGrids([
          this.#enemyMovementGridDeck,
          this.#currentPlayerMovementGridDeck,
        ]);

        isPhaseFinished = true;

        this._state = AttackPhaseState.INIT;

        break;
    }

    return isPhaseFinished;
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
        console.log("MISSILE WEAPON");
        let isYCoordinateLimitExceeded = false;
        let isXCoordinateLimitExceeded = false;
        if (
          this.#currentPlayerMovementGrid.getGridType() ===
          GridType.PLAYER_1_BATTLEFIELD
        ) {
          console.log("PLAYER 1 BATTLEFIELD");
          const targetMinYCoordinate =
            attackerBox.getYCoordinate() - 135 - attackerBox.getHeight();
  
          if (targetBox.getYCoordinate() >= targetMinYCoordinate) {
            isYCoordinateLimitExceeded = true;
          }

          const targetMinXCoordinate =
          attackerBox.getXCoordinate() - 135 ;
          const targetMaxXCoordinate =
            attackerBox.getXCoordinate() + 135 + attackerBox.getWidth();

          if (targetBox.getXCoordinate() >= targetMinXCoordinate && targetBox.getXCoordinate() <= targetMaxXCoordinate) {
            isXCoordinateLimitExceeded = true;
          }
        } else {
          const targetMaxYCoordinate =
            attackerBox.getYCoordinate() + 135 + attackerBox.getHeight();
  
          if (targetBox.getYCoordinate() <= targetMaxYCoordinate) {
            isYCoordinateLimitExceeded = true;
          }

          const targetMinXCoordinate =
          attackerBox.getXCoordinate() - 135;
          const targetMaxXCoordinate =
            attackerBox.getXCoordinate() + 135 + attackerBox.getWidth();

          if (targetBox.getXCoordinate() >= targetMinXCoordinate && targetBox.getXCoordinate() <= targetMaxXCoordinate) {
            isXCoordinateLimitExceeded = true;
          }
        }

        if (
          isXCoordinateLimitExceeded &&
          isYCoordinateLimitExceeded
        ) {
          console.log("TARGET NOT WITHIN REACH");
          isTargetWithinReach = false;
        } else {
          console.log("TARGET WITHIN REACH");
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

  #isMouseOnButtons(isParryActivated) {
    const mouseX = this._mouseInput.getMouseXCoordinate();
    const mouseY = this._mouseInput.getMouseYCoordinate();

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonSpacing = 50;
    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    const buttonY = globals.canvas.height / 2 + 100;

    const buttons = [
      {
        text: "YES",
        x: canvasWidthDividedBy2 - buttonWidth - buttonSpacing / 2,
        y: buttonY,
      },
      { text: "NO", x: canvasWidthDividedBy2 + buttonSpacing / 2, y: buttonY },
    ];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      if (
        mouseX >= button.x &&
        mouseX <= button.x + buttonWidth &&
        mouseY >= button.y &&
        mouseY <= button.y + buttonHeight &&
        this._mouseInput.isLeftButtonPressed()
      ) {
        if (button.text === "YES") {
          globals.isParryMenuOpen = false;
          return true;
        } else if (button.text === "NO") {
          globals.isParryMenuOpen = false;
          return false;
        }
      }
    }
    return isParryActivated;
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
