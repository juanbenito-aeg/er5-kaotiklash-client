import Phase from "./Phase.js";
import AttackEvent from "../Events/AttackEvent.js";
import {
  PlayerID,
  CardState,
  DeckType,
  GridType,
  AttackPhaseState,
} from "../Game/constants.js";

export default class AttackPhase extends Phase {
  #enemyMovementGridDeck;
  #currentPlayerMovementGridDeck;
  #enemyMovementGrid;
  #currentPlayerMovementGrid;
  #attacker;
  #target;

  constructor(
    state,
    mouseInput,
    enemyMovementGridDeck,
    currentPlayerMovementGridDeck,
    enemyMovementGrid,
    currentPlayerMovementGrid
  ) {
    super(state, mouseInput);

    this.#enemyMovementGridDeck = enemyMovementGridDeck;
    this.#currentPlayerMovementGridDeck = currentPlayerMovementGridDeck;
    this.#enemyMovementGrid = enemyMovementGrid;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
  }

  static create(currentPlayer, deckContainer, board, mouseInput) {
    let enemyMovementGridDeck;
    let currentPlayerMovementGridDeck;
    let enemyMovementGrid;
    let currentPlayerMovementGrid;

    enemyMovementGrid = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    currentPlayerMovementGrid = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    } else {
      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    }

    const attackPhase = new AttackPhase(
      AttackPhaseState.INIT,
      mouseInput,
      enemyMovementGridDeck,
      currentPlayerMovementGridDeck,
      enemyMovementGrid,
      currentPlayerMovementGrid
    );

    return attackPhase;
  }

  execute() {
    let isPhaseFinished = false;

    switch (this._state) {
      // PHASE INITIALIZATION
      case AttackPhaseState.INIT:
        this.#resetRelevantCardsStates([
          this.#enemyMovementGridDeck,
          this.#currentPlayerMovementGridDeck,
        ]);
        this._state = AttackPhaseState.SELECT_ATTACKER;
        break;

      // ATTACKER SELECTION
      case AttackPhaseState.SELECT_ATTACKER:
        this.#attacker = this.#lookForLeftClickedCard([
          this.#currentPlayerMovementGridDeck,
        ]);
        this._mouseInput.setLeftButtonPressedFalse();

        if (this.#attacker) {
          this._state = AttackPhaseState.SELECT_TARGET;
        }

        break;

      // TARGET SELECTION
      case AttackPhaseState.SELECT_TARGET:
        this.#lookForLeftClickedCard([this.#currentPlayerMovementGridDeck]);

        if (this.#attacker.getState() === CardState.PLACED) {
          // THE PREVIOUSLY SELECTED ATTACKER WAS DESELECTED
          this.#attacker = null;
          this._state = AttackPhaseState.SELECT_ATTACKER;
        } else {
          this.#target = this.#lookForLeftClickedCard([
            this.#enemyMovementGridDeck,
          ]);

          if (this.#target) {
            this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
          }
        }

        this._mouseInput.setLeftButtonPressedFalse();

        break;

      // CALCULATION AND APPLICATION OF DAMAGE
      case AttackPhaseState.CALC_AND_APPLY_DMG:
        const attackEvent = AttackEvent.create(
          this.#attacker,
          this.#target,
          this.#currentPlayerMovementGrid,
          this.#enemyMovementGrid
        );

        const wasTheAttackPerformed = attackEvent.execute();

        if (wasTheAttackPerformed) {
          this._state = AttackPhaseState.END;
        } else {
          this._state = AttackPhaseState.SELECT_TARGET;
        }

        break;

      // PHASE END
      case AttackPhaseState.END:
        this.#updateDecks([
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

  #checkIfAnyCardIsSelected(decksToCheck) {
    for (let i = 0; i < decksToCheck.length; i++) {
      const currentDeck = decksToCheck[i];

      const isAnyCardSelected = currentDeck.checkIfAnyCardIsSelected();

      if (isAnyCardSelected) {
        return true;
      }
    }
  }

  #lookForLeftClickedCard(decksToCheck) {
    if (this._mouseInput.isLeftButtonPressed()) {
      const isAnyCardSelected = this.#checkIfAnyCardIsSelected(decksToCheck);

      for (let i = 0; i < decksToCheck.length; i++) {
        const currentDeck = decksToCheck[i];

        const hoveredCard = currentDeck.lookForHoveredCard(this._mouseInput);

        for (let j = 0; j < currentDeck.getCards().length; j++) {
          const currentCard = currentDeck.getCards()[j];

          if (currentCard === hoveredCard) {
            if (!isAnyCardSelected) {
              currentCard.setState(CardState.SELECTED);
              return currentCard;
            } else if (currentCard.getState() === CardState.SELECTED) {
              currentCard.setState(CardState.PLACED);
              return currentCard;
            }
          }
        }
      }
    }
  }

  #updateDecks(decksToCheck) {
    for (let i = 0; i < decksToCheck.length; i++) {
      const currentDeck = decksToCheck[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        if (currentCard.getCurrentHP() === 0) {
          currentDeck.removeCard(currentCard);
        }
      }
    }
  }
}
