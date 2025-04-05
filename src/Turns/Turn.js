import InitialPhase from "./InitialPhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import MovePhase from "./MovePhase.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import EquipWeaponEvent from "../Events/EquipWeaponEvent.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import {
  PlayerID,
  CardState,
  DeckType,
  PhaseType,
  PhaseButton,
  EquipWeaponState,
  CardCategory,
  PhaseButtonData,
  GridType,
  BoxState,
} from "../Game/constants.js";
import { globals } from "../index.js";

export default class Turn {
  #isCurrentPhaseCanceled;
  #isCurrentPhaseFinished;
  #currentPhase;
  #numOfExecutedPhases;
  #phases;
  #deckContainer;
  #board;
  #mouseInput;
  #player;
  #events;
  #phaseMessage;
  #equipWeaponState;

  constructor(deckContainer, board, mouseInput, player, events, phaseMessage) {
    this.#isCurrentPhaseCanceled = false;
    this.#isCurrentPhaseFinished = false;
    this.#currentPhase = PhaseType.INVALID;
    this.#numOfExecutedPhases = 0;
    this.#phases = [];
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#mouseInput = mouseInput;
    this.#player = player;
    this.#events = events;
    this.#phaseMessage = phaseMessage;
    this.#equipWeaponState = EquipWeaponState.INIT;
  }

  fillPhases(currentPlayer) {
    if (this.#player.getID() === PlayerID.PLAYER_1) {
      const initialPhase = new InitialPhase(this.#deckContainer);
      initialPhase.execute();
    }

    const phaseTypes = [
      DrawCardPhase,
      PrepareEventPhase,
      PerformEventPhase,
      MovePhase,
      AttackPhase,
      DiscardCardPhase,
    ];

    for (let i = 0; i < phaseTypes.length; i++) {
      const currentPhase = phaseTypes[i].create(
        this.#player,
        this.#deckContainer,
        this.#board,
        this.#mouseInput,
        this.#events,
        currentPlayer,
        this.#phaseMessage
      );

      this.#phases.push(currentPhase);
    }
  }

  changeTurn(currentPlayer) {
    this.#numOfExecutedPhases = 0;

    /*  this.#swapTurnPosition(); */

    if (currentPlayer.getID() === PlayerID.PLAYER_1) {
      return PlayerID.PLAYER_2;
    } else {
      return PlayerID.PLAYER_1;
    }
  }

  /*  #swapTurnPosition() {
    /*  this.#displayDecksAndGrids(this.#deckContainer, this.#board); 
    this.#swapGridPosition();
  }

  #swapGridPosition() {
    const player1Grids = [
      this.#board.getGrids()[GridType.PLAYER_1_BATTLEFIELD],
      this.#board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND],
      this.#board.getGrids()[GridType.PLAYER_1_MAIN_CHARACTER],
      this.#board.getGrids()[GridType.PLAYER_1_MINIONS_DECK],
      this.#board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT],
    ];

    const player2Grids = [
      this.#board.getGrids()[GridType.PLAYER_2_BATTLEFIELD],
      this.#board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND],
      this.#board.getGrids()[GridType.PLAYER_2_MAIN_CHARACTER],
      this.#board.getGrids()[GridType.PLAYER_2_MINIONS_DECK],
      this.#board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT],
    ];

    for (let i = 0; i < player1Grids.length; i++) {
      this.#swapGridPositions(player1Grids[i], player2Grids[i]);
    }
  }

  #swapGridPositions(player1Grid, player2Grid) {
    for (let i = 0; i < player1Grid.getBoxes().length; i++) {
      for (let j = 0; j < player2Grid.getBoxes().length; j++) {
        const player1Box = player1Grid.getBoxes()[i];
        const player2Box = player2Grid.getBoxes()[j];
        const tempX = player1Box.getXCoordinate();
        const tempY = player1Box.getYCoordinate();

        //PLAYER 1 BOXES
        player1Box.setXCoordinate(player2Box.getXCoordinate());
        player1Box.setYCoordinate(player2Box.getYCoordinate());

        //PLAYER 2 BOXES
        player2Box.setXCoordinate(tempX);
        player2Box.setYCoordinate(tempY);
      }
    }
  }
  /*  #swapDeckPosition() {
    const player1Decks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS],
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_ACTIVE_EVENTS],
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND],
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION],
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MAIN_CHARACTER],
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY],
    ];
    const player2Decks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_ACTIVE_EVENTS],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MAIN_CHARACTER],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];

    //SWAP DECK POSITIONS FROM PLAYER 1 TO PLAYER 2 AND VICE VERSA
    for (let i = 0; i < player1Decks.length; i++) {
      this.#setCardsPositionsInBoxes(player1Decks[i]);
    }
  }

  #setCardsPositionsInBoxes(deck, grid) {
    for (let i = 0; i < deck.getCards().length; i++) {
      for (let j = 0; j < grid.getBoxes().length; j++) {
        const cards = deck.getCards()[i];
        const boxes = grid.getBoxes()[j];

        cards.setXCoordinate(boxes.getXCoordinate());
        cards.setYCoordinate(boxes.getYCoordinate());

        console.log("ola  ");
      }
    }
  }
 */

  execute() {
    if (this.#numOfExecutedPhases === 0) {
      this.#isCurrentPhaseFinished =
        this.#phases[PhaseType.DRAW_CARD].execute();
    }

    const isAnyCardExpanded = this.#expandCard();

    if (!isAnyCardExpanded) {
      if (this.#currentPhase === PhaseType.INVALID) {
        this.#equipWeapon();

        if (
          this.#equipWeaponState === EquipWeaponState.SELECT_WEAPON ||
          this.#equipWeaponState === EquipWeaponState.END
        ) {
          this.#phaseMessage.setCurrentContent(
            PhaseMessage.content.invalid[globals.language]
          );
        }
      } else {
        this.#isCurrentPhaseFinished =
          this.#phases[this.#currentPhase].execute();
      }

      if (this.#equipWeaponState === EquipWeaponState.SELECT_WEAPON) {
        this.#checkButtonClick();
      }

      if (this.#isCurrentPhaseCanceled || this.#isCurrentPhaseFinished) {
        this.#equipWeaponState = EquipWeaponState.INIT;

        this.#currentPhase = PhaseType.INVALID;

        if (this.#isCurrentPhaseCanceled) {
          this.#isCurrentPhaseCanceled = false;
        } else {
          this.#isCurrentPhaseFinished = false;
          this.#numOfExecutedPhases++;
        }

        globals.buttonDataGlobal[PhaseButton.SKIP_OR_CANCEL][
          PhaseButtonData.NAME
        ] = "Skip";
      }

      if (this.#numOfExecutedPhases === 4) {
        this.#currentPhase = PhaseType.DISCARD_CARD;
      }

      if (this.#numOfExecutedPhases === 5) {
        this.#currentPhase = PhaseType.INVALID;
        globals.isCurrentTurnFinished = true;
      }
    }
  }

  #expandCard() {
    const decksToCheck = [];

    if (this.#player.getID() === PlayerID.PLAYER_1) {
      decksToCheck.push(
        DeckType.PLAYER_1_CARDS_IN_HAND,
        DeckType.PLAYER_1_EVENTS_IN_PREPARATION,
        DeckType.PLAYER_1_MAIN_CHARACTER,
        DeckType.PLAYER_1_MINIONS_IN_PLAY
      );
    } else {
      decksToCheck.push(
        DeckType.PLAYER_2_CARDS_IN_HAND,
        DeckType.PLAYER_2_EVENTS_IN_PREPARATION,
        DeckType.PLAYER_2_MAIN_CHARACTER,
        DeckType.PLAYER_2_MINIONS_IN_PLAY
      );
    }

    decksToCheck.push(DeckType.JOSEPH);

    this.#setOrUnsetExpandedState(decksToCheck);

    const isAnyCardExpanded = this.#checkIfAnyCardIsExpanded(decksToCheck);
    return isAnyCardExpanded;
  }

  #setOrUnsetExpandedState(decksToCheck) {
    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          const hoveredCard = currentDeck.lookForHoveredCard();

          if (hoveredCard && hoveredCard.isRightClicked()) {
            const isAnyCardExpanded =
              this.#checkIfAnyCardIsExpanded(decksToCheck);

            if (!isAnyCardExpanded) {
              hoveredCard.setPreviousState(hoveredCard.getState());
              hoveredCard.setState(CardState.EXPANDED);
            } else if (hoveredCard.getState() === CardState.EXPANDED) {
              hoveredCard.setState(hoveredCard.getPreviousState());
            }
          }
        }
      }
    }
  }

  #checkIfAnyCardIsExpanded(decksToCheck) {
    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      for (let j = 0; j < decksToCheck.length; j++) {
        if (i === decksToCheck[j]) {
          const currentDeck = this.#deckContainer.getDecks()[i];

          const isAnyCardExpanded = currentDeck.checkIfAnyCardIsExpanded();

          if (isAnyCardExpanded) {
            return true;
          }
        }
      }
    }
  }

  getNumOfExecutedPhases() {
    return this.#numOfExecutedPhases;
  }

  #equipWeapon() {
    let playerXEventsInPreparationGrid;
    let playerXEventsInPreparationDeck;
    let playerXMinionsInPlayDeck;

    if (this.#player.getID() === globals.firstActivePlayerID) {
      playerXEventsInPreparationGrid =
        this.#board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];
    } else {
      playerXEventsInPreparationGrid =
        this.#board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];
    }

    if (this.#player.getID() === PlayerID.PLAYER_1) {
      playerXEventsInPreparationDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION];
      playerXMinionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    } else {
      playerXEventsInPreparationDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION];
      playerXMinionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    }

    let weapon;
    let minion;
    switch (this.#equipWeaponState) {
      case EquipWeaponState.INIT:
        this.#resetXDeckCardsToYState(
          playerXEventsInPreparationDeck,
          CardState.PLACED
        );
        this.#resetXDeckCardsToYState(
          playerXMinionsInPlayDeck,
          CardState.INACTIVE
        );

        this.#resetXGridBoxesToYState(
          playerXEventsInPreparationGrid,
          BoxState.INACTIVE
        );

        this.#equipWeaponState = EquipWeaponState.SELECT_WEAPON;

        break;

      // SELECT WEAPON TO EQUIP ON A MINION
      case EquipWeaponState.SELECT_WEAPON:
        weapon = playerXEventsInPreparationDeck.lookForHoveredCard();

        if (weapon && weapon.getCategory() === CardCategory.WEAPON) {
          if (!weapon.isLeftClicked()) {
            weapon.setState(CardState.HOVERED);
          } else if (weapon.getCurrentPrepTimeInRounds() === 0) {
            console.log("WEAPON SELECTED");

            weapon.setState(CardState.SELECTED);

            this.#equipWeaponState = EquipWeaponState.SELECT_MINION;
          }
        }

        break;

      // SELECT MINION TO EQUIP WEAPON ON
      case EquipWeaponState.SELECT_MINION:
        console.log("MINION SELECTION");

        this.#phaseMessage.setCurrentContent(
          PhaseMessage.content.equipWeapon.selectMinion[globals.language]
        );

        this.#resetXDeckCardsToYState(
          playerXEventsInPreparationDeck,
          CardState.INACTIVE,
          CardState.SELECTED
        );
        this.#resetXDeckCardsToYState(
          playerXMinionsInPlayDeck,
          CardState.PLACED,
          CardState.HOVERED
        );

        weapon = playerXEventsInPreparationDeck.lookForSelectedCard();

        if (weapon.isLeftClicked()) {
          console.log("WEAPON DESELECTED");

          // THE PREVIOUSLY SELECTED WEAPON WAS DESELECTED
          this.#equipWeaponState = EquipWeaponState.INIT;
        } else {
          minion = playerXMinionsInPlayDeck.lookForHoveredCard();

          if (minion) {
            if (!minion.isLeftClicked()) {
              minion.setState(CardState.HOVERED);
            } else if (!minion.getWeapon()) {
              minion.setState(CardState.SELECTED);

              this.#equipWeaponState = EquipWeaponState.EQUIP_WEAPON;
            }
          }
        }

        break;

      // PERFORM THE WEAPON EQUIPMENT
      case EquipWeaponState.EQUIP_WEAPON:
        console.log("WEAPON EQUIPMENT");

        this.#phaseMessage.setCurrentContent(
          PhaseMessage.content.equipWeapon.equipWeapon[globals.language]
        );

        weapon = playerXEventsInPreparationDeck.lookForSelectedCard();
        minion = playerXMinionsInPlayDeck.lookForSelectedCard();

        const equipWeaponEvent = new EquipWeaponEvent(weapon, minion);
        equipWeaponEvent.execute();

        this.#equipWeaponState = EquipWeaponState.END;

        break;

      // EVENT END
      case EquipWeaponState.END:
        console.log("EVENT END");

        weapon = playerXEventsInPreparationDeck.lookForSelectedCard();
        weapon.setState(CardState.INACTIVE);
        playerXEventsInPreparationDeck.removeCard(weapon);

        const boxWeaponWasPositionedIn = weapon.getBoxIsPositionedIn(
          playerXEventsInPreparationGrid,
          weapon
        );
        boxWeaponWasPositionedIn.resetCard();

        minion = playerXMinionsInPlayDeck.lookForSelectedCard();
        minion.setState(CardState.INACTIVE);

        this.#equipWeaponState = EquipWeaponState.INIT;

        break;
    }
  }

  #resetXDeckCardsToYState(deck, stateToSet, stateNotToOverWrite = -1) {
    for (let i = 0; i < deck.getCards().length; i++) {
      const currentCard = deck.getCards()[i];

      if (currentCard.getState() !== stateNotToOverWrite) {
        currentCard.setState(stateToSet);
      }
    }
  }

  #resetXGridBoxesToYState(grid, stateToSet, stateNotToOverWrite = -1) {
    for (let i = 0; i < grid.getBoxes().length; i++) {
      const currentBox = grid.getBoxes()[i];

      if (currentBox.getState() !== stateNotToOverWrite) {
        currentBox.setState(stateToSet);
      }
    }
  }

  #checkButtonClick() {
    const mouseX = this.#mouseInput.getMouseXCoordinate();
    const mouseY = this.#mouseInput.getMouseYCoordinate();

    if (this.#mouseInput.isLeftButtonPressed()) {
      for (let i = 0; i < globals.buttonDataGlobal.length; i++) {
        const buttonData = globals.buttonDataGlobal[i];

        const buttonXCoordinate = buttonData[0];
        const buttonYCoordinate = buttonData[1];
        const buttonWidth = buttonData[2];
        const buttonHeight = buttonData[3];

        if (
          mouseX >= buttonXCoordinate &&
          mouseX <= buttonXCoordinate + buttonWidth &&
          mouseY >= buttonYCoordinate &&
          mouseY <= buttonYCoordinate + buttonHeight
        ) {
          let playerXCardsInHand;
          if (this.#player.getID() === PlayerID.PLAYER_1) {
            playerXCardsInHand =
              this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];
          } else {
            playerXCardsInHand =
              this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];
          }
          const areThere6CardsInHand =
            playerXCardsInHand.getCards().length === 6;

          if (
            this.#currentPhase === PhaseType.INVALID ||
            (this.#currentPhase === PhaseType.DISCARD_CARD &&
              !areThere6CardsInHand)
          ) {
            if (i === PhaseButton.SKIP_OR_CANCEL) {
              this.#numOfExecutedPhases++;
            } else {
              this.#currentPhase = i;

              globals.buttonDataGlobal[PhaseButton.SKIP_OR_CANCEL][
                PhaseButtonData.NAME
              ] = "Cancel";
            }
          } else if (
            this.#currentPhase !== PhaseType.INVALID &&
            this.#currentPhase !== PhaseType.DISCARD_CARD
          ) {
            if (i === PhaseButton.SKIP_OR_CANCEL) {
              this.#phases[this.#currentPhase].reset();

              this.#isCurrentPhaseCanceled = true;
            }
          }
        }
      }
    }
  }
}
