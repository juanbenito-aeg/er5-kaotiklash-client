import Player from "./Player.js";
import Card from "../Decks/Card.js";
import CardView from "../Decks/CardView.js";
import Deck from "../Decks/Deck.js";
import DeckCreator from "../Decks/DeckCreator.js";
import GridCreator from "../Board/GridCreator.js";
import Turn from "../Turns/Turn.js";
import MouseInput from "./MouseInput.js";
import ImageSet from "./ImageSet.js";
import PhaseMessage from "../Messages/PhaseMessage.js";
import StateMessage from "../Messages/StateMessage.js";
import MinionTooltip from "../Tooltips/MinionTooltip.js";
import globals from "./globals.js";
import {
  GameState,
  CardCategory,
  DeckType,
  WeaponTypeID,
  ArmorTypeID,
  MinionTypeID,
  IconID,
  TemplateID,
  PlayerID,
  CardState,
  MainCharacterID,
  GridType,
  PhaseButtonData,
  Language,
} from "./constants.js";

export default class Game {
  #players;
  #currentPlayer;
  #deckContainer;
  #board;
  #turns;
  #mouseInput;
  #events;
  #phaseMessage;
  #stateMessages;
  #attackMenuData;
  #activeEventsTableData;
  #minionTooltip;

  static async create() {
    // "game" OBJECT CREATION
    const game = new Game();

    // PLAYERS CREATION
    const player1 = new Player(PlayerID.PLAYER_1, "Player 1");
    const player2 = new Player(PlayerID.PLAYER_2, "Player 2");
    game.#players = [player1, player2];

    // RANDOMLY ASSIGN PLAYER THAT STARTS PLAYING
    game.#currentPlayer = game.#players[Math.floor(Math.random() * 2)];

    // (!!!!!) DELETE AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
    globals.firstActivePlayerID = game.#currentPlayer.getID();

    // MAIN DECK CONFIGURATION FILE LOAD
    const url = "./src/mainDeck.json";
    const response = await fetch(url);
    const mainDeckConfig = await response.json();

    // DECKS CREATION
    const deckCreator = new DeckCreator(mainDeckConfig);
    game.#deckContainer = deckCreator.createMainDeck();
    game.#deckContainer = deckCreator.createAllDecks(
      game.#deckContainer.getDecks()[0]
    );

    // APPLICATION OF THE "CardView" DECORATOR TO ALL CARDS
    game.#applyCardViewToAllCards();

    // GRIDS (BOARD) CREATION
    const gridCreator = new GridCreator();
    game.#board = gridCreator.createAllGrids();
    game.#board.setImage(globals.boardImage);

    // MOUSEINPUT CREATION
    game.#mouseInput = new MouseInput();
    game.#mouseInput.addMouseEventListeners();

    // EVENTS CREATION
    game.#events = [];

    // PHASE MESSAGE OBJECT CREATION
    game.#phaseMessage = PhaseMessage.create(
      PhaseMessage.content.drawCard.initialDraw[globals.language]
    );

    game.#stateMessages = [];

    // ATTACK MENU DATA OBJECT CREATION
    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    const canvasHeightDividedBy2 = globals.canvas.height / 2;
    game.#attackMenuData = {
      isOpen: false,
      btns: [
        {
          text: "TRY TO BLOCK ATTACK",
          isActive: false,
          yCoordinate: canvasHeightDividedBy2 - 20,
        },
        {
          isActive: false,
          text: "USE POWER OF ARMOR",
          yCoordinate: canvasHeightDividedBy2 + 80,
        },
        {
          text: "PASS",
          isActive: true,
          yCoordinate: canvasHeightDividedBy2 + 180,
        },
      ],
      btnsWidth: 350,
      btnsHeight: 70,
      btnsXCoordinate: canvasWidthDividedBy2 - 175,
    };

    game.#minionTooltip = new MinionTooltip();

    // TURNS CREATION
    const turnPlayer1 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_1],
      game.#events,
      game.#phaseMessage,
      game.#stateMessages,
      game.#attackMenuData,
      game.#minionTooltip
    );
    turnPlayer1.fillPhases(game.#currentPlayer);
    const turnPlayer2 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_2],
      game.#events,
      game.#phaseMessage,
      game.#stateMessages,
      game.#attackMenuData,
      game.#minionTooltip
    );
    turnPlayer2.fillPhases(game.#currentPlayer);
    game.#turns = [turnPlayer1, turnPlayer2];

    game.#createPhaseButtons();

    game.#setInitialCardsCoordinates();

    game.#fillActiveEventsTableData();

    return game;
  }

  #applyCardViewToAllCards() {
    const updatedDecks = [];

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const updatedDeck = new Deck(i, []);
      updatedDecks.push(updatedDeck);

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        // CREATION OF OBJECTS FOR THE CURRENT CARD'S IMAGESET

        let cardImage;
        let smallVersionTemplateImage;
        let bigVersionTemplateImage;
        let iconsImages = {
          smallVersion: [
            globals.cardsIconsImages[IconID.EVENT_EFFECT_DIAMOND],
            globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
            globals.cardsIconsImages[IconID.EVENT_DURATION_DIAMOND],
          ],
          bigVersion: [
            globals.cardsIconsImages[IconID.EVENT_PREP_TIME],
            globals.cardsIconsImages[IconID.EVENT_DURATION],
          ],
        };
        let cardTypeIcon;

        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          cardImage = globals.cardsImages.main_characters[currentCard.getID()];

          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_SMALL];

          if (currentCard.getID() === MainCharacterID.JOSEPH) {
            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.JOSEPH_BIG];
          } else {
            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_BIG];
          }

          iconsImages = {};
        } else {
          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MINIONS_AND_EVENTS_SMALL];

          if (currentCard.getCategory() === CardCategory.MINION) {
            cardImage = globals.cardsImages.minions[currentCard.getID()];

            iconsImages = {
              smallVersion: [
                globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
                globals.cardsIconsImages[IconID.MINION_HP_DIAMOND],
                globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
                globals.cardsIconsImages[IconID.EVENT_TYPE_CIRCLE],
                globals.cardsIconsImages[IconID.WEAPON_MELEE_TYPE],
                globals.cardsIconsImages[IconID.WEAPON_HYBRID_TYPE],
                globals.cardsIconsImages[IconID.WEAPON_MISSILE_TYPE],
                globals.cardsIconsImages[IconID.EVENT_TYPE_CIRCLE],
                globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE],
                globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE],
                globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE],
              ],
              bigVersion: [
                globals.cardsIconsImages[IconID.MINION_HP],
                globals.cardsIconsImages[IconID.MINION_MADNESS],
                globals.cardsIconsImages[IconID.MINION_ATTACK],
                globals.cardsIconsImages[IconID.MINION_DEFENSE],
              ],
            };

            if (currentCard.getMinionTypeID() === MinionTypeID.SPECIAL) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_SPECIAL_BIG];

              cardTypeIcon =
                globals.cardsIconsImages[IconID.MINION_SPECIAL_TYPE];
            } else if (currentCard.getMinionTypeID() === MinionTypeID.WARRIOR) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WARRIORS_BIG];

              cardTypeIcon =
                globals.cardsIconsImages[IconID.MINION_WARRIOR_TYPE];
            } else {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WIZARDS_BIG];

              cardTypeIcon =
                globals.cardsIconsImages[IconID.MINION_WIZARD_TYPE];
            }
          } else if (currentCard.getCategory() === CardCategory.WEAPON) {
            cardImage = globals.cardsImages.weapons[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.WEAPONS_BIG];

            iconsImages = {
              smallVersion: [
                globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
                globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
                globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
              ],
              bigVersion: [
                globals.cardsIconsImages[IconID.WEAPON_DAMAGE],
                globals.cardsIconsImages[IconID.WEAPON_ARMOR_DURABILITY],
                globals.cardsIconsImages[IconID.EVENT_PREP_TIME],
              ],
            };

            if (currentCard.getWeaponTypeID() === WeaponTypeID.MELEE) {
              cardTypeIcon = globals.cardsIconsImages[IconID.WEAPON_MELEE_TYPE];
            } else if (currentCard.getWeaponTypeID() === WeaponTypeID.MISSILE) {
              cardTypeIcon =
                globals.cardsIconsImages[IconID.WEAPON_MISSILE_TYPE];
            } else {
              cardTypeIcon =
                globals.cardsIconsImages[IconID.WEAPON_HYBRID_TYPE];
            }
          } else if (currentCard.getCategory() === CardCategory.ARMOR) {
            cardImage = globals.cardsImages.armor[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

            iconsImages = {
              smallVersion: [
                globals.cardsIconsImages[IconID.EVENT_EFFECT_DIAMOND],
                globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
                globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
              ],
              bigVersion: [
                globals.cardsIconsImages[IconID.WEAPON_ARMOR_DURABILITY],
                globals.cardsIconsImages[IconID.EVENT_PREP_TIME],
              ],
            };

            if (currentCard.getArmorTypeID() === ArmorTypeID.LIGHT) {
              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE];
            } else if (currentCard.getArmorTypeID() === ArmorTypeID.MEDIUM) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.ARMOR_MEDIUM_BIG];

              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE];
            } else {
              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE];
            }
          } else if (currentCard.getCategory() === CardCategory.SPECIAL) {
            cardImage = globals.cardsImages.special_events[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.SPECIAL_EVENTS_BIG];

            cardTypeIcon = globals.cardsIconsImages[IconID.SPECIAL_TYPE];
          } else {
            cardImage = globals.cardsImages.rare_events[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.RARE_EVENTS_BIG];

            cardTypeIcon = globals.cardsIconsImages[IconID.RARE_TYPE];
          }
        }

        if (cardTypeIcon) {
          for (const cardVersion in iconsImages) {
            iconsImages[cardVersion].unshift(cardTypeIcon);

            if (
              currentCard.getCategory() !== CardCategory.MAIN_CHARACTER &&
              currentCard.getCategory() !== CardCategory.MINION
            ) {
              iconsImages[cardVersion].unshift(
                globals.cardsIconsImages[IconID.EVENT_TYPE_CIRCLE]
              );
            }
          }
        }

        const imageSet = new ImageSet(
          globals.cardsReverseImage,
          cardImage,
          smallVersionTemplateImage,
          bigVersionTemplateImage,
          iconsImages
        );

        currentCard = new CardView(currentCard, 0, 0, imageSet);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }

  #createPhaseButtons() {
    const buttonNames = [
      "Skip",
      "Prepare Event",
      "Perform Event",
      "Move",
      "Attack",
    ];

    const buttonsXCoordinate = this.#board
      .getGrids()
      [GridType.PHASE_BUTTONS].getBoxes()[0]
      .getXCoordinate();
    const buttonsWidth = 200;
    const buttonsHeight = 40;

    for (let i = 0; i < buttonNames.length; i++) {
      const currentButtonYCoordinate =
        this.#board
          .getGrids()
          [GridType.PHASE_BUTTONS].getBoxes()
          [i].getYCoordinate() + 5;

      const buttonData = [
        buttonsXCoordinate,
        currentButtonYCoordinate,
        buttonsWidth,
        buttonsHeight,
        buttonNames[i],
      ];
      globals.buttonDataGlobal.push(buttonData);
    }
  }

  #setInitialCardsCoordinates() {
    const activePlayerData = {
      mainCharacter: {},
      cardsInHandDeck: {},
      cardsInHandGrid: {},
      minionsInPlayDeck: {},
      minionsInPlayGrid: {},
    };

    const inactivePlayerData = {
      mainCharacter: {},
      cardsInHandDeck: {},
      cardsInHandGrid: {},
      minionsInPlayDeck: {},
      minionsInPlayGrid: {},
    };

    // SET (PART OF) THE ACTIVE PLAYER'S DATA
    activePlayerData.cardsInHandGrid =
      this.#board.getGrids()[GridType.PLAYER_1_CARDS_IN_HAND];
    activePlayerData.minionsInPlayGrid =
      this.#board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];

    // SET (PART OF) THE INACTIVE PLAYER'S DATA
    inactivePlayerData.cardsInHandGrid =
      this.#board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND];
    inactivePlayerData.minionsInPlayGrid =
      this.#board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];

    if (this.#currentPlayer === this.#players[PlayerID.PLAYER_1]) {
      // SET (PART OF) THE ACTIVE PLAYER'S DATA
      activePlayerData.mainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_1_MAIN_CHARACTER].getCards()[0];
      activePlayerData.cardsInHandDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];
      activePlayerData.minionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];

      // SET (PART OF) THE INACTIVE PLAYER'S DATA
      inactivePlayerData.mainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_2_MAIN_CHARACTER].getCards()[0];
      inactivePlayerData.cardsInHandDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];
      inactivePlayerData.minionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    } else {
      // SET (PART OF) THE ACTIVE PLAYER'S DATA
      activePlayerData.mainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_2_MAIN_CHARACTER].getCards()[0];
      activePlayerData.cardsInHandDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND];
      activePlayerData.minionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

      // SET (PART OF) THE INACTIVE PLAYER'S DATA
      inactivePlayerData.mainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_1_MAIN_CHARACTER].getCards()[0];
      inactivePlayerData.cardsInHandDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];
      inactivePlayerData.minionsInPlayDeck =
        this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    }

    const bottomRightMainCharacterBox = this.#board
      .getGrids()
      [GridType.PLAYER_1_MAIN_CHARACTER].getBoxes()[0];

    activePlayerData.mainCharacter.setXCoordinate(
      bottomRightMainCharacterBox.getXCoordinate()
    );
    activePlayerData.mainCharacter.setYCoordinate(
      bottomRightMainCharacterBox.getYCoordinate()
    );

    const upperLeftMainCharacterBox = this.#board
      .getGrids()
      [GridType.PLAYER_2_MAIN_CHARACTER].getBoxes()[0];

    inactivePlayerData.mainCharacter.setXCoordinate(
      upperLeftMainCharacterBox.getXCoordinate()
    );
    inactivePlayerData.mainCharacter.setYCoordinate(
      upperLeftMainCharacterBox.getYCoordinate()
    );

    const bothPlayersData = [activePlayerData, inactivePlayerData];

    for (let i = 0; i < bothPlayersData.length; i++) {
      const currentPlayer = bothPlayersData[i];

      // SET COORDINATES OF CARDS IN HAND
      for (let j = 0; j < 5; j++) {
        const currentEventCard = currentPlayer.cardsInHandDeck.getCards()[j];

        const currentCardsInHandBox =
          currentPlayer.cardsInHandGrid.getBoxes()[j];
        currentCardsInHandBox.setCard(currentEventCard);

        currentEventCard.setXCoordinate(currentCardsInHandBox.getXCoordinate());
        currentEventCard.setYCoordinate(currentCardsInHandBox.getYCoordinate());
      }

      // SET COORDINATES OF MINIONS IN PLAY
      for (let j = 0; j < 3; j++) {
        const currentMinionCard = currentPlayer.minionsInPlayDeck.getCards()[j];

        const currentBattlefieldBox =
          currentPlayer.minionsInPlayGrid.getBoxes()[j + 2];
        currentBattlefieldBox.setCard(currentMinionCard);

        currentMinionCard.setXCoordinate(
          currentBattlefieldBox.getXCoordinate()
        );
        currentMinionCard.setYCoordinate(
          currentBattlefieldBox.getYCoordinate()
        );
      }
    }
  }

  #fillActiveEventsTableData() {
    const tableX = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getXCoordinate();
    const tableY = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getYCoordinate();
    const tableWidth = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getWidth();
    const tableHeight = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getHeight();

    this.#activeEventsTableData = {
      columns: [
        {
          header: "Performed By",
          width: tableWidth * 0.4,
          lineXCoordinate: -1,
        },
        {
          header: "Event",
          width: tableWidth * 0.4,
          lineXCoordinate: -1,
        },
        {
          header: "Duration",
          width: tableWidth * 0.2,
          lineXCoordinate: -1,
        },
      ],
      rows: [
        {
          header: "",
          height: tableHeight * 0.15,
          lineYCoordinate: -1,
        },
        {
          header: this.#players[0].getName(),
          height: tableHeight * 0.35,
          lineYCoordinate: -1,
        },
        {
          header: this.#players[1].getName(),
          height: tableHeight * 0.35,
          lineYCoordinate: -1,
        },
        {
          header: "...",
          height: tableHeight * 0.15,
          lineYCoordinate: -1,
        },
      ],
    };

    for (let i = 0; i < this.#activeEventsTableData.rows.length; i++) {
      const currentColumn = this.#activeEventsTableData.columns[i];
      const currentRow = this.#activeEventsTableData.rows[i];

      if (i === 0) {
        currentColumn.lineXCoordinate = tableX + currentColumn.width;
        currentRow.lineYCoordinate = tableY + currentRow.height;
      } else {
        if (i !== this.#activeEventsTableData.rows.length - 1) {
          currentColumn.lineXCoordinate =
            this.#activeEventsTableData.columns[i - 1].lineXCoordinate +
            currentColumn.width;
        }

        currentRow.lineYCoordinate =
          this.#activeEventsTableData.rows[i - 1].lineYCoordinate +
          currentRow.height;
      }
    }
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {
    if (globals.isCurrentTurnFinished) {
      globals.isCurrentTurnFinished = false;

      if (globals.poisonOfTheAbyssEventData.isActive === false) {
        this.#healHarmedMinions();
      } else if (globals.poisonOfTheAbyssEventData.isActive === true) {
        this.#poisonMinions();
      }

      if (globals.decrepitThroneSkillData.isActive) {
        globals.decrepitThroneSkillData.turnsSinceActivation++;
      }

      const newCurrentPlayerID = this.#turns[
        this.#currentPlayer.getID()
      ].changeTurn(this.#currentPlayer);

      this.#currentPlayer = this.#players[newCurrentPlayerID];
    }

    this.#mouseInput.resetIsLeftClickedOnBoxes(this.#board);
    this.#mouseInput.detectMouseOverBox(this.#board);
    this.#mouseInput.detectBoxThatIsntHoveredAnymore(this.#board);
    this.#mouseInput.detectLeftClickOnBox(this.#board);

    this.#mouseInput.resetIsLeftClickedOnCards(this.#deckContainer);
    this.#mouseInput.resetIsRightClickedOnCards(this.#deckContainer);
    this.#mouseInput.detectMouseOverCard(this.#deckContainer);
    this.#mouseInput.detectCardThatIsntHoveredAnymore(this.#deckContainer);
    this.#mouseInput.detectLeftClickOnCard(this.#deckContainer);
    this.#mouseInput.detectRightClickOnCard(this.#deckContainer);

    if (!globals.gameWinner) {
      this.#turns[this.#currentPlayer.getID()].execute();
    }

    this.#mouseInput.setLeftButtonPressedFalse();

    this.#executeEvents();

    this.#updateStateMessages();

    this.#updatePlayersTotalHP();

    this.#checkIfGameOver();
  }

  #healHarmedMinions() {
    const minionsInPlayDecks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];

    for (let i = 0; i < minionsInPlayDecks.length; i++) {
      const currentDeck = minionsInPlayDecks[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        if (currentCard.getCurrentHP() < currentCard.getInitialHP()) {
          currentCard.setCurrentHP(currentCard.getInitialHP());
        }
      }
    }
  }

  #poisonMinions() {
    const minionsInPlayDecks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];

    if (globals.poisonOfTheAbyssEventData.isPlayer2Affected) {
      for (let i = 0; i < minionsInPlayDecks[0].getCards().length; i++) {
        const currentCard = minionsInPlayDecks[0].getCards()[i];

        currentCard.setCurrentHP(currentCard.getCurrentHP() - 5);
        let message = new StateMessage(
          "-5",
          `50px MedievalSharp`,
          "green",
          1,
          currentCard.getXCoordinate() + 55,
          currentCard.getYCoordinate() + 55
        );
        this.#stateMessages.push(message);
      }
    }
    if (globals.poisonOfTheAbyssEventData.isPlayer1Affected) {
      for (let i = 0; i < minionsInPlayDecks[1].getCards().length; i++) {
        const currentCard = minionsInPlayDecks[1].getCards()[i];

        currentCard.setCurrentHP(currentCard.getCurrentHP() - 5);
        let message = new StateMessage(
          "-5",
          `50px MedievalSharp`,
          "green",
          1,
          currentCard.getXCoordinate() + 55,
          currentCard.getYCoordinate() + 55
        );
        this.#stateMessages.push(message);
      }
    }
  }

  #updatePlayersTotalHP() {
    // PLAYER 1

    const player1MinionsDeck =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS];
    const player1MinionsInPlayDeck =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];

    const player1 = this.#players[PlayerID.PLAYER_1];
    const player1UpdatedTotalHP =
      this.#sumMinionsHP(player1MinionsDeck) +
      this.#sumMinionsHP(player1MinionsInPlayDeck);
    player1.setTotalHP(player1UpdatedTotalHP);

    // PLAYER 2

    const player2MinionsDeck =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS];
    const player2MinionsInPlayDeck =
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];

    const player2 = this.#players[PlayerID.PLAYER_2];
    const player2UpdatedTotalHP =
      this.#sumMinionsHP(player2MinionsDeck) +
      this.#sumMinionsHP(player2MinionsInPlayDeck);
    player2.setTotalHP(player2UpdatedTotalHP);
  }

  #sumMinionsHP(minionsDeck) {
    let totalHP = 0;

    for (let i = 0; i < minionsDeck.getCards().length; i++) {
      const currentMinion = minionsDeck.getCards()[i];
      const currentMinionHP = currentMinion.getCurrentHP();
      totalHP += currentMinionHP;
    }

    return totalHP;
  }

  #executeEvents() {
    for (let i = 0; i < this.#events.length; i++) {
      const event = this.#events[i];

      let enemy;
      if (this.#currentPlayer.getID() === PlayerID.PLAYER_1) {
        enemy = this.#players[PlayerID.PLAYER_2];
      } else {
        enemy = this.#players[PlayerID.PLAYER_1];
      }

      event.execute(this.#currentPlayer, enemy);

      if (!event.isActive()) {
        const eventCard = event.getEventCard();

        const activeEventsDeck =
          this.#deckContainer.getDecks()[DeckType.ACTIVE_EVENTS];

        if (Card.isCardWithinDeck(eventCard, activeEventsDeck)) {
          if (
            !(
              eventCard.getCategory() === CardCategory.MAIN_CHARACTER &&
              eventCard.getID() === MainCharacterID.JOSEPH
            )
          ) {
            eventCard.resetAttributes();

            const eventsDeck = this.#deckContainer.getDecks()[DeckType.EVENTS];
            eventsDeck.insertCard(eventCard);
          }

          activeEventsDeck.removeCard(eventCard);
        }

        this.#events.splice(i, 1);

        i--;
      }
    }
  }

  #checkIfGameOver() {
    for (let i = 0; i < this.#players.length; i++) {
      const currentPlayer = this.#players[i];

      if (currentPlayer.getTotalHP() === 0) {
        globals.gameWinner = this.#players[1 - i];
      }
    }
  }

  #updateStateMessages() {
    for (let i = 0; i < this.#stateMessages.length; i++) {
      let currentMessage = this.#stateMessages[i];

      let isFinished = currentMessage.execute();

      if (isFinished) {
        this.#stateMessages.splice(i, 1);
      }
    }
  }

  #render() {
    // CLEAR SCREEN
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    switch (globals.gameState) {
      case GameState.PLAYING:
        this.#renderGame();

        if (globals.activeVisibilitySkill) {
          globals.activeVisibilitySkill.renderVisibilityEffect(
            this.#currentPlayer.getID()
          );
        }

        if (this.#minionTooltip.hasTooltip()) {
          this.#minionTooltip.render();
        }

        if (this.#attackMenuData.isOpen) {
          this.#renderAttackMenu();
        }

        if (globals.gameWinner) {
          this.#renderGameWinner();
        }

        break;
    }
  }

  #renderGame() {
    this.#renderBoard();
    this.#renderGrids();
    this.#renderPlayersInfo();
    this.#renderPhaseButtons();
    this.#renderActiveEventsTable();
    this.#renderPhaseMessage();
    this.#renderCardsReverse();
    this.#renderCards();
    this.#renderStateMessages();
  }

  #renderBoard() {
    globals.ctx.drawImage(
      globals.boardImage,
      0,
      0,
      3584,
      2048,
      0,
      0,
      globals.canvas.width,
      globals.canvas.height
    );
  }

  #renderGrids() {
    const colors = [
      "white",
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "pink",
      "darkcyan",
      "magenta",
      "cyan",
      "gold",
      "grey",
      "bisque",
      "black",
      "blueviolet",
    ];

    for (let i = 0; i < this.#board.getGrids().length; i++) {
      const currentGrid = this.#board.getGrids()[i];

      for (let j = 0; j < currentGrid.getBoxes().length; j++) {
        const currentBox = currentGrid.getBoxes()[j];

        globals.ctx.strokeStyle = colors[i];
        globals.ctx.strokeRect(
          currentBox.getXCoordinate(),
          currentBox.getYCoordinate(),
          currentBox.getWidth(),
          currentBox.getHeight()
        );
      }
    }
  }

  #renderPlayersInfo() {
    const activePlayerX = this.#board
      .getGrids()
      [GridType.PLAYER_1_MAIN_CHARACTER].getBoxes()[0]
      .getXCoordinate();
    const activePlayerY = this.#board
      .getGrids()
      [GridType.PLAYER_1_MAIN_CHARACTER].getBoxes()[0]
      .getYCoordinate();

    const inactivePlayerX = this.#board
      .getGrids()
      [GridType.PLAYER_2_MAIN_CHARACTER].getBoxes()[0]
      .getXCoordinate();
    const inactivePlayerY = this.#board
      .getGrids()
      [GridType.PLAYER_2_MAIN_CHARACTER].getBoxes()[0]
      .getYCoordinate();

    let player1X, player1Y, player2X, player2Y;

    // (!!!!!) MODIFY AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
    if (
      /* this.#currentPlayer.getID() */ globals.firstActivePlayerID ===
      PlayerID.PLAYER_1
    ) {
      player1X = activePlayerX + 100;
      player1Y = activePlayerY + 225;
      player2X = inactivePlayerX + 100;
      player2Y = inactivePlayerY + 225;
    } else {
      player1X = inactivePlayerX + 100;
      player1Y = inactivePlayerY + 225;
      player2X = activePlayerX + 100;
      player2Y = activePlayerY + 225;
    }

    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.fillStyle = "yellow";

    const player1 = this.#players[PlayerID.PLAYER_1];
    globals.ctx.fillText(player1.getName(), player1X, player1Y);
    globals.ctx.fillText(
      `HP: ${player1.getTotalHP()}`,
      player1X,
      player1Y + 25
    );

    const player2 = this.#players[PlayerID.PLAYER_2];
    globals.ctx.fillText(player2.getName(), player2X, player2Y);
    globals.ctx.fillText(
      `HP: ${player2.getTotalHP()}`,
      player2X,
      player2Y + 25
    );
  }

  #renderPhaseButtons() {
    const numOfExecutedPhases =
      this.#turns[this.#currentPlayer.getID()].getNumOfExecutedPhases();
    const TOTAL_PHASES = 5;

    const phaseText = `Phase: ${numOfExecutedPhases + 1}/${TOTAL_PHASES}`;
    globals.ctx.fillStyle = "white";
    globals.ctx.font = "24px MedievalSharp";
    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.fillText(phaseText, 500, 675);

    for (let i = 0; i < globals.buttonDataGlobal.length; i++) {
      const currentButton = globals.buttonDataGlobal[i];

      globals.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      globals.ctx.shadowBlur = 10;
      globals.ctx.shadowOffsetX = 4;
      globals.ctx.shadowOffsetY = 4;

      globals.ctx.fillStyle = "darkcyan";
      globals.ctx.beginPath();
      globals.ctx.moveTo(
        currentButton[PhaseButtonData.X_COORDINATE] + 10,
        currentButton[PhaseButtonData.Y_COORDINATE]
      );
      globals.ctx.lineTo(
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH] -
          10,
        currentButton[PhaseButtonData.Y_COORDINATE]
      );
      globals.ctx.quadraticCurveTo(
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH],
        currentButton[PhaseButtonData.Y_COORDINATE],
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH],
        currentButton[PhaseButtonData.Y_COORDINATE] + 10
      );
      globals.ctx.lineTo(
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH],
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT] -
          10
      );
      globals.ctx.quadraticCurveTo(
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH],
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT],
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH] -
          10,
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT]
      );
      globals.ctx.lineTo(
        currentButton[PhaseButtonData.X_COORDINATE] + 10,
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT]
      );
      globals.ctx.quadraticCurveTo(
        currentButton[PhaseButtonData.X_COORDINATE],
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT],
        currentButton[PhaseButtonData.X_COORDINATE],
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT] -
          10
      );
      globals.ctx.lineTo(
        currentButton[PhaseButtonData.X_COORDINATE],
        currentButton[PhaseButtonData.Y_COORDINATE] + 10
      );
      globals.ctx.quadraticCurveTo(
        currentButton[PhaseButtonData.X_COORDINATE],
        currentButton[PhaseButtonData.Y_COORDINATE],
        currentButton[PhaseButtonData.X_COORDINATE] + 10,
        currentButton[PhaseButtonData.Y_COORDINATE]
      );
      globals.ctx.closePath();
      globals.ctx.fill();

      globals.ctx.fillStyle = "white";
      globals.ctx.font = "18px MedievalSharp";
      globals.ctx.textAlign = "center";
      globals.ctx.textBaseline = "middle";
      globals.ctx.fillText(
        currentButton[PhaseButtonData.NAME],
        currentButton[PhaseButtonData.X_COORDINATE] +
          currentButton[PhaseButtonData.WIDTH] / 2,
        currentButton[PhaseButtonData.Y_COORDINATE] +
          currentButton[PhaseButtonData.HEIGHT] / 2
      );
    }
  }

  #renderActiveEventsTable() {
    const tableX = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getXCoordinate();
    const tableY = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getYCoordinate();
    const tableWidth = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getWidth();
    const tableHeight = this.#board
      .getGrids()
      [GridType.ACTIVE_EVENTS_TABLE].getBoxes()[0]
      .getHeight();

    globals.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    globals.ctx.shadowBlur = 10;
    globals.ctx.shadowOffsetX = 4;
    globals.ctx.shadowOffsetY = 4;

    globals.ctx.fillStyle = "darkcyan";
    globals.ctx.fillRect(tableX, tableY, tableWidth, tableHeight);

    globals.ctx.shadowBlur = 0;
    globals.ctx.shadowOffsetX = 0;
    globals.ctx.shadowOffsetY = 0;

    this.#renderColumnAndRowLinesAndHeaders(
      tableY,
      tableX,
      tableWidth,
      tableHeight
    );

    this.#renderActiveEventsData();
  }

  #renderColumnAndRowLinesAndHeaders(tableY, tableX, tableWidth, tableHeight) {
    globals.ctx.strokeStyle = "black";
    globals.ctx.lineWidth = 2;

    globals.ctx.fillStyle = "white";
    globals.ctx.font = "18px MedievalSharp";
    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";

    const isJosephChaoticEventActive =
      this.#deckContainer.getDecks()[DeckType.JOSEPH].getCards().length === 1;
    this.#activeEventsTableData.rows[3].header = isJosephChaoticEventActive
      ? "Joseph"
      : "...";

    for (let i = 0; i < this.#activeEventsTableData.rows.length; i++) {
      const currentColumn = this.#activeEventsTableData.columns[i];

      if (i !== this.#activeEventsTableData.rows.length - 1) {
        // COLUMN LINE
        globals.ctx.beginPath();
        globals.ctx.moveTo(currentColumn.lineXCoordinate, tableY);
        globals.ctx.lineTo(currentColumn.lineXCoordinate, tableY + tableHeight);
        globals.ctx.stroke();

        // COLUMN HEADER
        globals.ctx.fillText(
          currentColumn.header,
          currentColumn.lineXCoordinate - currentColumn.width / 2,
          tableY + this.#activeEventsTableData.rows[0].height / 2
        );
      }

      const currentRow = this.#activeEventsTableData.rows[i];

      // ROW LINE
      globals.ctx.beginPath();
      globals.ctx.moveTo(tableX, currentRow.lineYCoordinate);
      globals.ctx.lineTo(tableX + tableWidth, currentRow.lineYCoordinate);
      globals.ctx.stroke();

      // ROW HEADER
      globals.ctx.fillText(
        currentRow.header,
        tableX + this.#activeEventsTableData.columns[0].width / 2,
        currentRow.lineYCoordinate - currentRow.height / 2
      );
    }
  }

  #renderActiveEventsData() {
    globals.ctx.fillStyle = "black";
    globals.ctx.font = "14px MedievalSharp";

    const activeEventsDeck =
      this.#deckContainer.getDecks()[DeckType.ACTIVE_EVENTS];

    let player1EventsCounter = 0;
    let player2EventsCounter = 0;

    for (let i = 0; i < this.#events.length; i++) {
      const currentEvent = this.#events[i];
      const currentEventCard = currentEvent.getEventCard();

      if (Card.isCardWithinDeck(currentEventCard, activeEventsDeck)) {
        let eventName = currentEventCard.getName();
        const currentDuration = currentEventCard.getCurrentDurationInRounds();

        const currentEventExecutor = currentEvent.getExecutor();

        let currentEntryY;

        if (
          currentEventCard.getCategory() === CardCategory.MAIN_CHARACTER &&
          currentEventCard.getID() === MainCharacterID.JOSEPH
        ) {
          eventName = currentEventCard.getChaoticEventName();

          currentEntryY =
            this.#activeEventsTableData.rows[3].lineYCoordinate -
            this.#activeEventsTableData.rows[3].height / 2;
        } else if (currentEventExecutor === this.#players[0]) {
          player1EventsCounter++;

          currentEntryY =
            this.#activeEventsTableData.rows[1].lineYCoordinate -
            this.#activeEventsTableData.rows[1].height +
            21 * player1EventsCounter;
        } else {
          player2EventsCounter++;

          currentEntryY =
            this.#activeEventsTableData.rows[2].lineYCoordinate -
            this.#activeEventsTableData.rows[2].height +
            21 * player2EventsCounter;
        }

        globals.ctx.fillText(
          eventName,
          this.#activeEventsTableData.columns[1].lineXCoordinate -
            this.#activeEventsTableData.columns[1].width / 2,
          currentEntryY
        );
        globals.ctx.fillText(
          `${currentDuration} Round${currentDuration > 1 ? "s" : ""}`,
          this.#activeEventsTableData.columns[2].lineXCoordinate -
            this.#activeEventsTableData.columns[2].width / 2,
          currentEntryY
        );
      }
    }
  }

  #renderPhaseMessage() {
    const messageBoxX = this.#board
      .getGrids()
      [GridType.MESSAGES].getBoxes()[0]
      .getXCoordinate();
    const messageBoxY = this.#board
      .getGrids()
      [GridType.MESSAGES].getBoxes()[0]
      .getYCoordinate();

    const messageBoxWidth = this.#board
      .getGrids()
      [GridType.MESSAGES].getBoxes()[0]
      .getWidth();
    const messageBoxHeight = this.#board
      .getGrids()
      [GridType.MESSAGES].getBoxes()[0]
      .getHeight();

    globals.ctx.fillStyle = "black";
    globals.ctx.fillRect(
      messageBoxX,
      messageBoxY,
      messageBoxWidth,
      messageBoxHeight
    );

    globals.ctx.fillStyle = "white";
    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";

    globals.ctx.fillText(
      this.#phaseMessage.getCurrentContent(),
      messageBoxX + messageBoxWidth / 2,
      messageBoxY + messageBoxHeight / 2
    );
  }

  #renderCardsReverse() {
    const cardsReversePosition = {
      player1Minions: {
        x: this.#board
          .getGrids()
          [GridType.PLAYER_1_MINIONS_DECK].getBoxes()[0]
          .getXCoordinate(),
        y: this.#board
          .getGrids()
          [GridType.PLAYER_1_MINIONS_DECK].getBoxes()[0]
          .getYCoordinate(),
      },
      player2Minions: {
        x: this.#board
          .getGrids()
          [GridType.PLAYER_2_MINIONS_DECK].getBoxes()[0]
          .getXCoordinate(),
        y: this.#board
          .getGrids()
          [GridType.PLAYER_2_MINIONS_DECK].getBoxes()[0]
          .getYCoordinate(),
      },
      events: {
        x: this.#board
          .getGrids()
          [GridType.EVENTS_DECK].getBoxes()[0]
          .getXCoordinate(),
        y: this.#board
          .getGrids()
          [GridType.EVENTS_DECK].getBoxes()[0]
          .getYCoordinate(),
      },
    };

    for (const cardsReverse in cardsReversePosition) {
      this.#renderCardReverse(
        cardsReversePosition[cardsReverse].x,
        cardsReversePosition[cardsReverse].y,
        200,
        200
      );
    }
  }

  #renderCardReverse(xCoordinate, yCoordinate, width, height) {
    globals.ctx.drawImage(
      globals.cardsReverseImage,
      0,
      0,
      625,
      801,
      xCoordinate,
      yCoordinate,
      width,
      height
    );
  }

  #renderCards() {
    let expandedCard;

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const isDeckCardsInHandOfInactivePlayer =
        (this.#currentPlayer.getID() === PlayerID.PLAYER_1 &&
          currentDeck ===
            this.#deckContainer.getDecks()[DeckType.PLAYER_2_CARDS_IN_HAND]) ||
        (this.#currentPlayer.getID() === PlayerID.PLAYER_2 &&
          currentDeck ===
            this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND]);

      if (
        currentDeck.getDeckType() !== DeckType.EVENTS &&
        currentDeck.getDeckType() !== DeckType.ACTIVE_EVENTS &&
        currentDeck.getDeckType() !== DeckType.PLAYER_1_MINIONS &&
        currentDeck.getDeckType() !== DeckType.PLAYER_2_MINIONS &&
        currentDeck.getDeckType() !== DeckType.LUCRETIA_DEERS
      ) {
        for (let j = 0; j < currentDeck.getCards().length; j++) {
          const currentCard = currentDeck.getCards()[j];

          if (isDeckCardsInHandOfInactivePlayer) {
            this.#renderCardReverse(
              currentCard.getXCoordinate(),
              currentCard.getYCoordinate(),
              110,
              110
            );
          } else {
            this.#renderCard(currentCard);
          }

          if (currentCard.getState() === CardState.EXPANDED) {
            expandedCard = currentCard;
          }
        }
      }
    }

    if (expandedCard) {
      this.#renderExpandedCard(expandedCard);
    }
  }

  #renderCard(card) {
    switch (card.getCategory()) {
      case CardCategory.MAIN_CHARACTER:
        this.#renderMainCharacter(card);
        break;

      case CardCategory.MINION:
        this.#renderMinion(card);
        break;

      case CardCategory.WEAPON:
        this.#renderWeapon(card);
        break;

      case CardCategory.ARMOR:
        this.#renderArmor(card);
        break;

      case CardCategory.SPECIAL:
        this.#renderSpecial(card);
        break;

      case CardCategory.RARE:
        this.#renderRare(card);
        break;
    }
  }

  #renderCardImageAndTemplate(card, xCoordinate, yCoordinate) {
    let cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    let cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

    if (card.getCategory() === CardCategory.MAIN_CHARACTER) {
      cardAndTemplateWidth =
        globals.imagesDestinationSizes.mainCharactersSmallVersion.width;
      cardAndTemplateHeight =
        globals.imagesDestinationSizes.mainCharactersSmallVersion.height;
    }

    // RENDER THE CARD IMAGE
    globals.ctx.drawImage(
      card.getImageSet().getCard(),
      0,
      0,
      1024,
      1024,
      xCoordinate,
      yCoordinate,
      cardAndTemplateWidth,
      cardAndTemplateHeight
    );

    // RENDER THE CARD TEMPLATE
    globals.ctx.drawImage(
      card.getImageSet().getSmallVersionTemplate(),
      0,
      0,
      625,
      801,
      xCoordinate,
      yCoordinate,
      cardAndTemplateWidth,
      cardAndTemplateHeight
    );
  }

  #renderMainCharacter(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);
  }

  #renderMinion(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);

    this.#renderMinionIcons(card, xCoordinate, yCoordinate);

    this.#renderMinionAttributesValues(card, xCoordinate, yCoordinate);
  }

  #renderMinionIcons(minion, xCoordinate, yCoordinate) {
    const icons = minion.getImageSet().getIcons().smallVersion;

    const iconsPositions = [
      {
        // TYPE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
        width: 35,
        height: 35,
      },
      {
        // ATTACK
        x: xCoordinate - 17,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // HP
        x: xCoordinate + 37,
        y: yCoordinate + 92,
        width: 35,
        height: 35,
      },
      {
        // DEFENSE
        x: xCoordinate + 92,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // (WEAPON) TYPE CIRCLE
        x: xCoordinate - 17,
        y: yCoordinate - 17,
        width: minion.getWeapon() ? 35 : 0,
        height: minion.getWeapon() ? 35 : 0,
      },
      {
        // (WEAPON) MELEE TYPE
        x: xCoordinate - 10,
        y: yCoordinate - 10,
        width:
          minion.getWeapon() && minion.getWeaponTypeID() === WeaponTypeID.MELEE
            ? 20
            : 0,
        height:
          minion.getWeapon() && minion.getWeaponTypeID() === WeaponTypeID.MELEE
            ? 20
            : 0,
      },
      {
        // (WEAPON) HYBRID TYPE
        x: xCoordinate - 10,
        y: yCoordinate - 10,
        width:
          minion.getWeapon() && minion.getWeaponTypeID() === WeaponTypeID.HYBRID
            ? 20
            : 0,
        height:
          minion.getWeapon() && minion.getWeaponTypeID() === WeaponTypeID.HYBRID
            ? 20
            : 0,
      },
      {
        // (WEAPON) MISSILE TYPE
        x: xCoordinate - 10,
        y: yCoordinate - 10,
        width:
          minion.getWeapon() &&
          minion.getWeaponTypeID() === WeaponTypeID.MISSILE
            ? 20
            : 0,
        height:
          minion.getWeapon() &&
          minion.getWeaponTypeID() === WeaponTypeID.MISSILE
            ? 20
            : 0,
      },
      {
        // (ARMOR) TYPE CIRCLE
        x:
          xCoordinate +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width -
          17,
        y: yCoordinate - 17,
        width: minion.getArmor() ? 35 : 0,
        height: minion.getArmor() ? 35 : 0,
      },
      {
        // (ARMOR) LIGHT TYPE
        x:
          xCoordinate +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width -
          10,
        y: yCoordinate - 10,
        width:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.LIGHT
            ? 20
            : 0,
        height:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.LIGHT
            ? 20
            : 0,
      },
      {
        // (ARMOR) MEDIUM TYPE
        x:
          xCoordinate +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width -
          10,
        y: yCoordinate - 10,
        width:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.MEDIUM
            ? 20
            : 0,
        height:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.MEDIUM
            ? 20
            : 0,
      },
      {
        // (ARMOR) HEAVY TYPE
        x:
          xCoordinate +
          globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width -
          10,
        y: yCoordinate - 10,
        width:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.HEAVY
            ? 20
            : 0,
        height:
          minion.getArmor() && minion.getArmorTypeID() === ArmorTypeID.HEAVY
            ? 20
            : 0,
      },
    ];

    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }
  }

  #renderMinionAttributesValues(minion, xCoordinate, yCoordinate) {
    const attributesRenderingData = {
      attack: {
        value: minion.getCurrentAttack(),
        x: xCoordinate,
        y: yCoordinate + 59,
        hasBoostIndicator: false,
      },
      hp: {
        value: minion.getCurrentHP(),
        x: xCoordinate + 55,
        y: yCoordinate + 111,
        hasBoostIndicator: false,
      },
      defense: {
        value: minion.getCurrentDefense(),
        x: xCoordinate + 110,
        y: yCoordinate + 59,
        hasBoostIndicator: false,
        hasNerfIndicator: false,
      },
    };

    if (
      minion.getCurrentAttack() > minion.getInitialAttack() ||
      minion.getWeapon()
    ) {
      if (minion.getWeapon()) {
        attributesRenderingData.attack.value += minion.getWeaponCurrentDamage();
      }

      attributesRenderingData.attack.hasBoostIndicator = true;
    }

    if (minion.getArmor()) {
      attributesRenderingData.hp.value += minion.getArmorCurrentDurability();
      attributesRenderingData.hp.hasBoostIndicator = true;
    }

    if (minion.getCurrentDefense() > minion.getInitialDefense()) {
      attributesRenderingData.defense.hasBoostIndicator = true;
    } else if (minion.getCurrentDefense() < minion.getInitialDefense()) {
      attributesRenderingData.defense.hasNerfIndicator = true;
    }

    globals.ctx.save();

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.lineWidth = "3.5";
    globals.ctx.fillStyle = "black";

    for (const attribute in attributesRenderingData) {
      globals.ctx.strokeStyle = "black";

      if (attributesRenderingData[attribute].hasBoostIndicator) {
        globals.ctx.fillStyle = "yellow";
      } else if (attributesRenderingData[attribute].hasNerfIndicator) {
        globals.ctx.fillStyle = "rgb(255 186 162)";
      } else {
        globals.ctx.strokeStyle = "transparent";
        globals.ctx.fillStyle = "black";
      }

      globals.ctx.strokeText(
        attributesRenderingData[attribute].value,
        attributesRenderingData[attribute].x,
        attributesRenderingData[attribute].y
      );

      globals.ctx.fillText(
        attributesRenderingData[attribute].value,
        attributesRenderingData[attribute].x,
        attributesRenderingData[attribute].y
      );
    }

    globals.ctx.restore();
  }

  #renderWeapon(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: xCoordinate + 44,
        y: yCoordinate - 11,
        width: 20,
        height: 20,
      },
      {
        // DAMAGE
        x: xCoordinate - 17,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // PREPARATION TIME
        x: xCoordinate + 37,
        y: yCoordinate + 92,
        width: 35,
        height: 35,
      },
      {
        // DURABILITY
        x: xCoordinate + 92,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getCurrentDamage(),
      xCoordinate,
      yCoordinate + 59
    );
    globals.ctx.fillText(
      card.getCurrentDurability(),
      xCoordinate + 55,
      yCoordinate + 111
    );
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 110,
      yCoordinate + 59
    );
  }

  #renderArmor(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: xCoordinate + 44,
        y: yCoordinate - 11,
        width: 20,
        height: 20,
      },
      {
        // SPECIAL EFFECT
        x: xCoordinate - 17,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // PREPARATION TIME
        x: xCoordinate + 37,
        y: yCoordinate + 92,
        width: 35,
        height: 35,
      },
      {
        // DURABILITY
        x: xCoordinate + 92,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText("SE", xCoordinate, yCoordinate + 62);
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 114
    );
    globals.ctx.fillText(
      card.getCurrentDurability(),
      xCoordinate + 110,
      yCoordinate + 62
    );
  }

  #renderSpecial(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: xCoordinate + 37,
        y: yCoordinate - 18,
        width: 35,
        height: 35,
      },
      {
        // EFFECT
        x: xCoordinate - 17,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // PREPARATION TIME
        x: xCoordinate + 37,
        y: yCoordinate + 92,
        width: 35,
        height: 35,
      },
      {
        // DURATION
        x: xCoordinate + 92,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText("EF", xCoordinate, yCoordinate + 62);
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 114
    );
    globals.ctx.fillText(
      card.getCurrentDurationInRounds(),
      xCoordinate + 110,
      yCoordinate + 62
    );
  }

  #renderRare(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    this.#renderCardImageAndTemplate(card, xCoordinate, yCoordinate);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: xCoordinate + 42,
        y: yCoordinate - 12,
        width: 25,
        height: 25,
      },
      {
        // EFFECT
        x: xCoordinate - 17,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
      {
        // PREPARATION TIME
        x: xCoordinate + 37,
        y: yCoordinate + 92,
        width: 35,
        height: 35,
      },
      {
        // DURATION
        x: xCoordinate + 92,
        y: yCoordinate + 40,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText("EF", xCoordinate, yCoordinate + 62);
    globals.ctx.fillText(0, xCoordinate + 55, yCoordinate + 114);
    globals.ctx.fillText(
      card.getCurrentDurationInRounds(),
      xCoordinate + 110,
      yCoordinate + 62
    );
  }

  #renderExpandedCard(expandedCard) {
    switch (expandedCard.getCategory()) {
      case CardCategory.MAIN_CHARACTER:
        if (expandedCard.getID() === MainCharacterID.JOSEPH) {
          this.#renderExpandedJoseph(expandedCard);
        } else {
          this.#renderExpandedMainCharacter(expandedCard);
        }
        break;

      case CardCategory.MINION:
        this.#renderExpandedMinion(expandedCard);
        break;

      case CardCategory.WEAPON:
        this.#renderExpandedWeapon(expandedCard);
        break;

      case CardCategory.ARMOR:
        this.#renderExpandedArmor(expandedCard);
        break;

      case CardCategory.SPECIAL:
        this.#renderExpandedSpecial(expandedCard);
        break;

      case CardCategory.RARE:
        this.#renderExpandedRare(expandedCard);
        break;
    }
  }

  #renderExpandedCardImageAndTemplate(card) {
    // DARKEN THE BACKGROUND TO PUT THE FOCUS ON THE EXPANDED CARD
    globals.ctx.globalAlpha = 0.5;
    globals.ctx.fillStyle = "black";
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.globalAlpha = 1;

    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    const canvasHeightDividedBy2 = globals.canvas.height / 2;
    globals.ctx.textAlign = "center";

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.allCardsBigVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.allCardsBigVersion.height;

    // RENDER THE CARD IMAGE
    globals.ctx.drawImage(
      card.getImageSet().getCard(),
      0,
      0,
      1024,
      1024,
      canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
      canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
      cardAndTemplateWidth,
      cardAndTemplateHeight
    );

    // RENDER THE CARD TEMPLATE
    globals.ctx.drawImage(
      card.getImageSet().getBigVersionTemplate(),
      0,
      0,
      625,
      801,
      canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
      canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
      cardAndTemplateWidth,
      cardAndTemplateHeight
    );
  }

  #renderExpandedJoseph(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.fillStyle = "black";
    globals.ctx.font = "24px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 700);

    const chaoticEventString =
      globals.language === Language.ENGLISH
        ? "Chaotic Event: "
        : "Gertaera Kaotikoa: ";
    globals.ctx.fillText(
      chaoticEventString + card.getChaoticEventName(),
      canvasWidthDividedBy2,
      760
    );

    globals.ctx.fillText(
      card.getChaoticEventDescription(),
      canvasWidthDividedBy2,
      790
    );
  }

  #renderExpandedMainCharacter(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.fillStyle = "white";
    globals.ctx.font = "22px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 700);

    const specialSkillString =
      globals.language === Language.ENGLISH
        ? "Special Skill:"
        : "Trebetasun Berezia:";
    globals.ctx.fillText(specialSkillString, canvasWidthDividedBy2, 760);

    globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 780);
  }

  #renderExpandedMinion(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE
        x: 1075,
        y: 327,
        width: 35,
        height: 35,
      },
      {
        // HP
        x: 1100,
        y: 750,
        width: 42,
        height: 42,
      },
      {
        // MADNESS
        x: 1147,
        y: 750,
        width: 35,
        height: 35,
      },
      {
        // ATTACK
        x: 1200,
        y: 752,
        width: 28,
        height: 28,
      },
      {
        // DEFENSE
        x: 1250,
        y: 750,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getInitialHP(), 1112, 792);
    globals.ctx.fillText(card.getInitialMadness(), 1160, 792);
    globals.ctx.fillText(card.getInitialAttack(), 1210, 792);
    globals.ctx.fillText(card.getInitialDefense(), 1262, 792);
    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 347);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 690);
  }

  #renderExpandedWeapon(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1065,
        y: 321,
        width: 28,
        height: 28,
      },
      {
        // TYPE
        x: 1070,
        y: 325,
        width: 20,
        height: 20,
      },
      {
        // DAMAGE
        x: 1050,
        y: 768,
        width: 35,
        height: 35,
      },
      {
        // DURABILITY
        x: 1130,
        y: 758,
        width: 55,
        height: 55,
      },
      {
        // PREPARATION TIME
        x: 1220,
        y: 765,
        width: 42,
        height: 42,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getInitialDamage(), 1105, 792);
    globals.ctx.fillText(card.getInitialDurability(), 1190, 792);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1270, 792);
    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 342);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 720);
  }

  #renderExpandedArmor(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1065,
        y: 321,
        width: 28,
        height: 28,
      },
      {
        // TYPE
        x: 1070,
        y: 325,
        width: 20,
        height: 20,
      },
      {
        // DURABILITY
        x: 1050,
        y: 768,
        width: 55,
        height: 55,
      },
      {
        // PREPARATION TIME
        x: 1130,
        y: 758,
        width: 42,
        height: 42,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    let descriptionXCoordinate = 640;

    if (card.getArmorTypeID() !== ArmorTypeID.MEDIUM) {
      let specialEffectUsableBy;

      if (card.getArmorTypeID() === ArmorTypeID.HEAVY) {
        specialEffectUsableBy =
          globals.language === Language.ENGLISH ? "Warriors" : "Gudariek";
      } else {
        specialEffectUsableBy =
          globals.language === Language.ENGLISH ? "Wizards" : "Magoek";
      }

      const specialEffectString =
        globals.language === Language.ENGLISH
          ? `Special Effect Usable by ${specialEffectUsableBy}:`
          : `${specialEffectUsableBy} Erabil Dezaketen Efektu Berezia:`;
      globals.ctx.fillText(specialEffectString, canvasWidthDividedBy2, 715);

      globals.ctx.fillText(card.getSpecialEffect(), canvasWidthDividedBy2, 740);
    } else {
      descriptionXCoordinate = 740;
    }

    globals.ctx.fillText(card.getInitialDurability(), 1110, 785);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1180, 785);
    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 340);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(
      card.getDescription(),
      canvasWidthDividedBy2,
      descriptionXCoordinate
    );
  }

  #renderExpandedSpecial(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1065,
        y: 321,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: 1070,
        y: 325,
        width: 30,
        height: 30,
      },
      {
        // PREPARATION TIME
        x: 1050,
        y: 758,
        width: 42,
        height: 42,
      },
      {
        // DURATION
        x: 1130,
        y: 758,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 340);

    const effectString =
      globals.language === Language.ENGLISH ? "Effect:" : "Efektua:";
    globals.ctx.fillText(effectString, canvasWidthDividedBy2, 730);

    globals.ctx.fillText(card.getEffect(), canvasWidthDividedBy2, 750);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1110, 785);
    globals.ctx.fillText(card.getInitialDurationInRounds(), 1180, 785);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 670);
  }

  #renderExpandedRare(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1065,
        y: 321,
        width: 35,
        height: 35,
      },
      {
        // TYPE
        x: 1070,
        y: 325,
        width: 30,
        height: 30,
      },
      {
        // PREPARATION TIME
        x: 1050,
        y: 758,
        width: 42,
        height: 42,
      },
      {
        // DURATION
        x: 1130,
        y: 758,
        width: 35,
        height: 35,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 30, 30);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 340);

    const effectString =
      globals.language === Language.ENGLISH ? "Effect:" : "Efektua:";
    globals.ctx.fillText(effectString, canvasWidthDividedBy2, 730);

    globals.ctx.fillText(card.getEffect(), canvasWidthDividedBy2, 750);
    globals.ctx.fillText(0, 1110, 785);
    globals.ctx.fillText(card.getInitialDurationInRounds(), 1180, 785);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 670);
  }

  #renderStateMessages() {
    globals.ctx.save();

    for (let i = 0; i < this.#stateMessages.length; i++) {
      const currentMessage = this.#stateMessages[i];

      globals.ctx.shadowBlur = 20;
      globals.ctx.shadowColor = "black";
      globals.ctx.font = currentMessage.getFont();
      globals.ctx.fillStyle = currentMessage.getColor();

      for (let i = 0; i < 15; i++) {
        globals.ctx.fillText(
          currentMessage.getContent(),
          currentMessage.getXPosition(),
          currentMessage.getYPosition()
        );
      }
    }

    globals.ctx.restore();
  }

  #renderAttackMenu() {
    globals.ctx.save();

    globals.ctx.globalAlpha = 0.5;
    globals.ctx.fillStyle = "black";
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.globalAlpha = 1;

    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    const canvasHeightDividedBy2 = globals.canvas.height / 2;
    globals.ctx.textAlign = "center";

    globals.ctx.shadowBlur = 20;
    globals.ctx.shadowColor = "black";

    globals.ctx.fillStyle = "white";
    globals.ctx.font = "100px MedievalSharp";
    globals.ctx.fillText(
      "WHAT DO YOU WANT TO DO?",
      canvasWidthDividedBy2,
      canvasHeightDividedBy2 - 200
    );

    globals.ctx.shadowBlur = 10;
    globals.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    globals.ctx.font = "24px MedievalSharp";
    globals.ctx.textBaseline = "middle";

    for (let i = 0; i < this.#attackMenuData.btns.length; i++) {
      const currentBtn = this.#attackMenuData.btns[i];

      if (currentBtn.isActive) {
        globals.ctx.globalAlpha = 1;
      } else {
        globals.ctx.globalAlpha = 0.65;
      }

      globals.ctx.fillStyle = "darkcyan";

      globals.ctx.beginPath();
      globals.ctx.moveTo(
        this.#attackMenuData.btnsXCoordinate + 10,
        currentBtn.yCoordinate
      );
      globals.ctx.lineTo(
        this.#attackMenuData.btnsXCoordinate +
          this.#attackMenuData.btnsWidth -
          10,
        currentBtn.yCoordinate
      );
      globals.ctx.quadraticCurveTo(
        this.#attackMenuData.btnsXCoordinate + this.#attackMenuData.btnsWidth,
        currentBtn.yCoordinate,
        this.#attackMenuData.btnsXCoordinate + this.#attackMenuData.btnsWidth,
        currentBtn.yCoordinate + 10
      );
      globals.ctx.lineTo(
        this.#attackMenuData.btnsXCoordinate + this.#attackMenuData.btnsWidth,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight - 10
      );
      globals.ctx.quadraticCurveTo(
        this.#attackMenuData.btnsXCoordinate + this.#attackMenuData.btnsWidth,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight,
        this.#attackMenuData.btnsXCoordinate +
          this.#attackMenuData.btnsWidth -
          10,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight
      );
      globals.ctx.lineTo(
        this.#attackMenuData.btnsXCoordinate + 10,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight
      );
      globals.ctx.quadraticCurveTo(
        this.#attackMenuData.btnsXCoordinate,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight,
        this.#attackMenuData.btnsXCoordinate,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight - 10
      );
      globals.ctx.lineTo(
        this.#attackMenuData.btnsXCoordinate,
        currentBtn.yCoordinate + 10
      );
      globals.ctx.quadraticCurveTo(
        this.#attackMenuData.btnsXCoordinate,
        currentBtn.yCoordinate,
        this.#attackMenuData.btnsXCoordinate + 10,
        currentBtn.yCoordinate
      );
      globals.ctx.closePath();
      globals.ctx.fill();

      globals.ctx.fillStyle = "white";
      globals.ctx.fillText(
        currentBtn.text,
        this.#attackMenuData.btnsXCoordinate +
          this.#attackMenuData.btnsWidth / 2,
        currentBtn.yCoordinate + this.#attackMenuData.btnsHeight / 2
      );
    }

    globals.ctx.restore();
  }

  #renderGameWinner() {
    globals.ctx.globalAlpha = 0.35;
    globals.ctx.fillStyle = "black";
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
    globals.ctx.globalAlpha = 1;

    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    const canvasHeightDividedBy2 = globals.canvas.height / 2;
    globals.ctx.textAlign = "center";

    globals.ctx.shadowBlur = 20;
    globals.ctx.shadowColor = "black";
    globals.ctx.fillStyle = "white";

    const gameWinnerName = globals.gameWinner.getName().toUpperCase();
    globals.ctx.font = "140px MedievalSharp";
    for (let i = 0; i < 6; i++) {
      globals.ctx.fillText(
        gameWinnerName,
        canvasWidthDividedBy2,
        canvasHeightDividedBy2 - 50
      );
    }

    globals.ctx.font = "100px MedievalSharp";
    for (let i = 0; i < 3; i++) {
      globals.ctx.fillText(
        "WON",
        canvasWidthDividedBy2,
        canvasHeightDividedBy2 + 100
      );
    }
  }
}
