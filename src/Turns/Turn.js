import InitialPhase from "./InitialPhase.js";
import DrawCardPhase from "./DrawCardPhase.js";
import AttackPhase from "./AttackPhase.js";
import MovePhase from "./MovePhase.js";
import PrepareEventPhase from "./PrepareEventPhase.js";
import PerformEventPhase from "./PerformEventPhase.js";
import DiscardCardPhase from "./DiscardCardPhase.js";
import EquipWeaponOrArmorEvent from "../Events/EquipWeaponOrArmorEvent.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import globals from "../Game/globals.js";
import {
  PlayerID,
  CardState,
  DeckType,
  PhaseType,
  PhaseButton,
  EquipWeaponOrArmorState,
  CardCategory,
  PhaseButtonData,
  GridType,
  BoxState,
  MinionTypeID,
} from "../Game/constants.js";

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
  #stateMessages;
  #attackMenuData;
  #equipWeaponOrArmorState;
  #minionTooltip;
  #hoverTime;
  #lastHoveredCardId;
  #eventsData;

  constructor(
    deckContainer,
    board,
    mouseInput,
    player,
    events,
    phaseMessage,
    stateMessages,
    attackMenuData,
    minionTooltip,
    eventsData
  ) {
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
    this.#stateMessages = stateMessages;
    this.#attackMenuData = attackMenuData;
    this.#equipWeaponOrArmorState = EquipWeaponOrArmorState.INIT;
    this.#minionTooltip = minionTooltip;
    this.#hoverTime = 0;
    this.#lastHoveredCardId = null;
    this.#eventsData = eventsData;
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
        this.#phaseMessage,
        this.#stateMessages,
        this.#attackMenuData,
        this.#eventsData
      );

      this.#phases.push(currentPhase);
    }
  }

  changeTurn(currentPlayer) {
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
      this.#updateMinionTooltip();

      if (this.#currentPhase === PhaseType.INVALID) {
        this.#equipWeaponOrArmor();

        if (
          this.#equipWeaponOrArmorState ===
            EquipWeaponOrArmorState.SELECT_WEAPON_OR_ARMOR ||
          this.#equipWeaponOrArmorState === EquipWeaponOrArmorState.END
        ) {
          this.#phaseMessage.setCurrentContent(
            PhaseMessage.content.invalid[globals.language]
          );
        }
      } else {
        this.#isCurrentPhaseFinished =
          this.#phases[this.#currentPhase].execute();
      }

      if (
        this.#equipWeaponOrArmorState === EquipWeaponOrArmorState.INIT ||
        this.#equipWeaponOrArmorState ===
          EquipWeaponOrArmorState.SELECT_WEAPON_OR_ARMOR
      ) {
        this.#checkButtonClick();
      }

      if (this.#isCurrentPhaseCanceled || this.#isCurrentPhaseFinished) {
        this.#equipWeaponOrArmorState = EquipWeaponOrArmorState.INIT;

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
        this.#numOfExecutedPhases = 0;
        globals.isCurrentTurnFinished = true;
      }
    } else {
      this.#minionTooltip.clearTooltip();
      this.#hoverTime = 0;
      this.#lastHoveredCardId = null;
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
              return;
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

  #updateMinionTooltip() {
    const tooltipDelay = 1.0;

    const playerXMinionsInPlayDeck =
      this.#player.getID() === PlayerID.PLAYER_1
        ? this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY]
        : this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

    const currentHoveredMinion = playerXMinionsInPlayDeck.lookForHoveredCard();

    if (currentHoveredMinion) {
      const currentCardId = currentHoveredMinion.getID();
      const isSameCard = this.#lastHoveredCardId === currentCardId;
      this.#lastHoveredCardId = currentCardId;

      this.#hoverTime = isSameCard
        ? this.#hoverTime + globals.deltaTime
        : globals.deltaTime;

      const cardCenterX =
        currentHoveredMinion.getXCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width / 2;
      const cardCenterY =
        currentHoveredMinion.getYCoordinate() +
        globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height / 2;

      if (this.#hoverTime >= tooltipDelay) {
        const content = this.#minionTooltip.getContent(currentHoveredMinion);
        this.#minionTooltip.showTooltip(content, cardCenterX, cardCenterY);
      }
    } else {
      this.#minionTooltip.clearTooltip();
      this.#hoverTime = 0;
      this.#lastHoveredCardId = null;
    }
  }

  getNumOfExecutedPhases() {
    return this.#numOfExecutedPhases;
  }

  #equipWeaponOrArmor() {
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

    let weaponOrArmor;
    let minion;
    switch (this.#equipWeaponOrArmorState) {
      case EquipWeaponOrArmorState.INIT:
        this.#resetXDeckCardsToYState(
          playerXEventsInPreparationDeck,
          CardState.PLACED
        );
        this.#resetXDeckCardsToYState(
          playerXMinionsInPlayDeck,
          CardState.INACTIVE
        );

        this.#equipWeaponOrArmorState =
          EquipWeaponOrArmorState.SELECT_WEAPON_OR_ARMOR;

        break;

      // SELECT WEAPON OR ARMOR TO EQUIP ON A MINION
      case EquipWeaponOrArmorState.SELECT_WEAPON_OR_ARMOR:
        weaponOrArmor = playerXEventsInPreparationDeck.lookForHoveredCard();

        if (
          weaponOrArmor &&
          (weaponOrArmor.getCategory() === CardCategory.WEAPON ||
            weaponOrArmor.getCategory() === CardCategory.ARMOR)
        ) {
          if (!weaponOrArmor.isLeftClicked()) {
            weaponOrArmor.setState(CardState.HOVERED);
          } else if (weaponOrArmor.getCurrentPrepTimeInRounds() === 0) {
            weaponOrArmor.setState(CardState.SELECTED);

            this.#equipWeaponOrArmorState =
              EquipWeaponOrArmorState.SELECT_MINION;
          }
        }

        break;

      // SELECT MINION TO EQUIP WEAPON OR ARMOR ON
      case EquipWeaponOrArmorState.SELECT_MINION:
        this.#phaseMessage.setCurrentContent(
          PhaseMessage.content.equipWeaponOrArmor.selectMinion[globals.language]
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

        weaponOrArmor = playerXEventsInPreparationDeck.lookForSelectedCard();

        if (weaponOrArmor.isLeftClicked()) {
          console.log("WEAPON OR ARMOR DESELECTED");

          // THE PREVIOUSLY SELECTED WEAPON OR ARMOR WAS DESELECTED
          this.#equipWeaponOrArmorState = EquipWeaponOrArmorState.INIT;
        } else {
          minion = playerXMinionsInPlayDeck.lookForHoveredCard();

          if (minion) {
            // STATE MESSAGE DATA
            const nMsgXCoordinate =
              minion.getXCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .width /
                2;
            const nMsgYCoordinate =
              minion.getYCoordinate() +
              globals.imagesDestinationSizes.minionsAndEventsSmallVersion
                .height /
                2;

            if (!minion.isLeftClicked()) {
              minion.setState(CardState.HOVERED);
            } else if (minion.getMinionTypeID() === MinionTypeID.SPECIAL) {
              // DEER STATE MESSAGE CREATION
              const deerWeaponsMsg = new StateMessage(
                "DEER CANNOT EQUIP WEAPONS OR ARMOR",
                "20px MedievalSharp",
                "red",
                4,
                nMsgXCoordinate,
                nMsgYCoordinate
              );
              this.#stateMessages.push(deerWeaponsMsg);
            } else if (
              (weaponOrArmor.getCategory() === CardCategory.WEAPON &&
                !minion.getWeapon()) ||
              (weaponOrArmor.getCategory() === CardCategory.ARMOR &&
                !minion.getArmor())
            ) {
              // EQUIPMENT STATE MESSAGE CREATION
              const gearedUpMsg = new StateMessage(
                "GEARED UP!",
                "20px MedievalSharp",
                "yellow",
                4,
                nMsgXCoordinate,
                nMsgYCoordinate
              );
              this.#stateMessages.push(gearedUpMsg);
              this.#player.addUsedCards();

              minion.setState(CardState.SELECTED);

              this.#equipWeaponOrArmorState =
                EquipWeaponOrArmorState.EQUIP_WEAPON_OR_ARMOR;
            }
          }
        }

        break;

      // PERFORM THE WEAPON OR ARMOR EQUIPMENT
      case EquipWeaponOrArmorState.EQUIP_WEAPON_OR_ARMOR:
        this.#phaseMessage.setCurrentContent(
          PhaseMessage.content.equipWeaponOrArmor.equip[globals.language]
        );

        weaponOrArmor = playerXEventsInPreparationDeck.lookForSelectedCard();
        minion = playerXMinionsInPlayDeck.lookForSelectedCard();

        const equipWeaponOrArmorEvent = new EquipWeaponOrArmorEvent(
          weaponOrArmor,
          minion
        );
        equipWeaponOrArmorEvent.execute();

        this.#equipWeaponOrArmorState = EquipWeaponOrArmorState.END;

        break;

      // EVENT END
      case EquipWeaponOrArmorState.END:
        weaponOrArmor = playerXEventsInPreparationDeck.lookForSelectedCard();
        weaponOrArmor.setState(CardState.INACTIVE);
        playerXEventsInPreparationDeck.removeCard(weaponOrArmor);

        const boxWeaponOrArmorWasPositionedIn =
          weaponOrArmor.getBoxIsPositionedIn(
            playerXEventsInPreparationGrid,
            weaponOrArmor
          );
        boxWeaponOrArmorWasPositionedIn.resetCard();

        minion = playerXMinionsInPlayDeck.lookForSelectedCard();
        minion.setState(CardState.INACTIVE);

        this.#equipWeaponOrArmorState = EquipWeaponOrArmorState.INIT;

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
            } else if (
              i === PhaseType.ATTACK &&
              this.#eventsData.judgmentAncients.isActive &&
              this.#player.getID() ===
                this.#eventsData.judgmentAncients.affectedPlayerID
            ) {
              const cannotAttackDueToActiveEventMsg = new StateMessage(
                "CANNOT ATTACK DUE TO ACTIVE EVENT",
                "20px MedievalSharp",
                "red",
                4,
                buttonXCoordinate + buttonWidth / 2,
                buttonYCoordinate + buttonHeight / 2
              );

              this.#stateMessages.push(cannotAttackDueToActiveEventMsg);
            } else if (
              this.#eventsData.decrepitThroneSkill.isActive &&
              this.#player !==
                this.#eventsData.decrepitThroneSkill.playerWithDecrepitThrone &&
              this.#eventsData.decrepitThroneSkill.turnsSinceActivation !== 3
            ) {
              const cannotDoAnythingDueToActiveEventMsg = new StateMessage(
                "CANNOT DO ALMOST ANYTHING DUE TO THE CURSE OF THE THRONE",
                "20px MedievalSharp",
                "red",
                3,
                buttonXCoordinate + buttonWidth / 2,
                buttonYCoordinate + buttonHeight / 2
              );

              this.#stateMessages.push(cannotDoAnythingDueToActiveEventMsg);
            } else if (
              this.#currentPhase === PhaseType.INVALID &&
              (!this.#eventsData.decrepitThroneSkill.isActive ||
                this.#player ===
                  this.#eventsData.decrepitThroneSkill
                    .playerWithDecrepitThrone ||
                this.#eventsData.decrepitThroneSkill.turnsSinceActivation === 3)
            ) {
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
