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
    currentPLayerMovementGridDeck,
    enemyMovementGrid,
    currentPlayerMovementGrid
  ) {
    super(state, mouseInput);

    this.#enemyMovementGridDeck = enemyMovementGridDeck;
    this.#currentPlayerMovementGridDeck = currentPLayerMovementGridDeck;
    this.#enemyMovementGrid = enemyMovementGrid;
    this.#currentPlayerMovementGrid = currentPlayerMovementGrid;
  }

  static create(currentPlayer, deckContainer, board, mouseInput) {
    let enemyMovementGridDeck;
    let currentPlayerMovementGridDeck;
    let enemyMovementGrid;
    let currentPlayerMovementGrid;

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      enemyMovementGrid = board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
      currentPlayerMovementGrid =
        board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    } else {
      enemyMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
      currentPlayerMovementGridDeck =
        deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
      enemyMovementGrid = board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
      currentPlayerMovementGrid =
        board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
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
    let hoveredCard;

    this.#lookForCardThatIsntHoveredAnymore([
      this.#enemyMovementGridDeck,
      this.#currentPlayerMovementGridDeck,
    ]);

    switch (this._state) {
      // PHASE INITIALIZATION
      case AttackPhaseState.INIT:
        this.#resetRelevantCardsStates();
        this._state = AttackPhaseState.SELECT_ATTACKER;
        break;

      // ATTACKER SELECTION
      case AttackPhaseState.SELECT_ATTACKER:
        hoveredCard = this.#lookForHoveredCard([
          this.#currentPlayerMovementGridDeck,
        ]);

        this.#attacker = this.#lookForLeftClickedCard(
          [this.#currentPlayerMovementGridDeck],
          hoveredCard
        );

        if (this.#attacker) {
          this._state = AttackPhaseState.SELECT_TARGET;
        }

        break;

      // TARGET SELECTION
      case AttackPhaseState.SELECT_TARGET:
        hoveredCard = this.#lookForHoveredCard([
          this.#enemyMovementGridDeck,
          this.#currentPlayerMovementGridDeck,
        ]);

        const leftClickedCard = this.#lookForLeftClickedCard(
          [this.#enemyMovementGridDeck, this.#currentPlayerMovementGridDeck],
          hoveredCard
        );

        if (leftClickedCard) {
          if (
            leftClickedCard.getPreviousState() === CardState.SELECTED &&
            leftClickedCard.getState() === CardState.PLACED
          ) {
            // THE PREVIOUSLY SELECTED ATTACKER WAS DESELECTED
            this.#attacker = null;
            this._state = AttackPhaseState.SELECT_ATTACKER;
          } else if (
            leftClickedCard.getState() === CardState.INACTIVE_SELECTED
          ) {
            this.#target = leftClickedCard;
            this._state = AttackPhaseState.CALC_AND_APPLY_DMG;
          }
        }

        break;

      // CALCULATION AND APPLICATION OF DAMAGE
      case AttackPhaseState.CALC_AND_APPLY_DMG:
        const attackEvent = AttackEvent.create(this.#attacker, this.#target);
        attackEvent.execute();

        this._state = AttackPhaseState.END;

        break;

      // PHASE END
      case AttackPhaseState.END:
        this.#updateDecks([
          this.#enemyMovementGridDeck,
          this.#currentPlayerMovementGridDeck,
        ]);
        break;
    }
  }

  #lookForCardThatIsntHoveredAnymore(decksToCheck) {
    for (let i = 0; i < decksToCheck.length; i++) {
      const currentDeck = decksToCheck[i];

      const notHoveredCard = currentDeck.lookForCardThatIsntHoveredAnymore(
        this._mouseInput
      );

      if (notHoveredCard) {
        notHoveredCard.setState(notHoveredCard.getPreviousState());
      }
    }
  }

  #resetRelevantCardsStates() {
    this.#resetSpecifiedDeckCardsStates(
      this.#enemyMovementGridDeck,
      CardState.INACTIVE
    );
    this.#resetSpecifiedDeckCardsStates(
      this.#currentPlayerMovementGridDeck,
      CardState.PLACED
    );
  }

  #resetSpecifiedDeckCardsStates(deck, stateToSet) {
    for (let i = 0; i < deck.getCards().length; i++) {
      const currentCard = deck.getCards()[i];
      currentCard.setPreviousState(stateToSet);
      currentCard.setState(stateToSet);
    }
  }

  #lookForHoveredCard(decksToCheck) {
    const isAnyCardSelected = this.#checkIfAnyCardIsSelected(decksToCheck);

    for (let i = 0; i < decksToCheck.length; i++) {
      const currentDeck = decksToCheck[i];

      const hoveredCard = currentDeck.lookForHoveredCard(this._mouseInput);

      if (hoveredCard) {
        if (hoveredCard.getState() === CardState.INACTIVE) {
          hoveredCard.setPreviousState(CardState.INACTIVE);
          hoveredCard.setState(CardState.INACTIVE_HOVERED);
        } else if (
          !isAnyCardSelected &&
          hoveredCard.getState() === CardState.PLACED
        ) {
          hoveredCard.setPreviousState(CardState.PLACED);
          hoveredCard.setState(CardState.HOVERED);
        }

        return hoveredCard;
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

  #lookForLeftClickedCard(decksToCheck, hoveredCard) {
    if (this._mouseInput.isLeftButtonPressed() && hoveredCard) {
      this._mouseInput.setLeftButtonPressedFalse();

      for (let i = 0; i < decksToCheck.length; i++) {
        const currentDeck = decksToCheck[i];

        for (let j = 0; j < currentDeck.getCards().length; j++) {
          const currentCard = currentDeck.getCards()[j];

          if (currentCard === hoveredCard) {
            if (currentCard.getState() === CardState.HOVERED) {
              currentCard.setState(CardState.SELECTED);
            } else if (currentCard.getState() === CardState.SELECTED) {
              currentCard.setState(currentCard.getPreviousState());
              currentCard.setPreviousState(CardState.SELECTED);
            } else if (currentCard.getState() === CardState.INACTIVE_HOVERED) {
              currentCard.setState(CardState.INACTIVE_SELECTED);
            }

            return currentCard;
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
