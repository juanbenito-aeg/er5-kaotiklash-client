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
import ChatMessage from "../Messages/ChatMessage.js";
import MinionTooltip from "../Tooltips/MinionTooltip.js";
import RemainingCardsTooltip from "../Tooltips/RemainingCardsTooltip.js";
import MainCharacterParticle from "../Particles/MainCharacterParticle.js";
import GameStats from "./GameStats.js";
import globals from "./globals.js";
import { checkIfMusicIsPlayingAndIfSoReset, setMusic } from "../index.js";
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
  ChatMessageType,
  ChatMessagePosition,
  ParticleState,
  ParticleID,
  Sound,
  Music,
  BoxState,
} from "./constants.js";
import Physics from "./Physics.js";

export default class Game {
  #players;
  #currentPlayer;
  #winner;
  #isGameFinished;
  #deckContainer;
  #board;
  #turns;
  #mouseInput;
  #events;
  #phaseMessage;
  #stateMessages;
  #chatMessages;
  #attackMenuData;
  #activeEventsTableData;
  #minionTooltip;
  #remainingCardsTooltip;
  #stats;
  #eventsData;
  #edgeAnimation;
  #alphaState;
  #particles;
  #borderTimer;
  #highlightedBoxes;
  #animationCards;
  #blinkingAnimation;

  static async create(playersNames) {
    // "game" OBJECT CREATION
    const game = new Game();

    // PLAYERS CREATION
    const player1 = new Player(PlayerID.PLAYER_1, playersNames.loggedIn);
    const player2 = new Player(PlayerID.PLAYER_2, playersNames.opponent);
    game.#players = [player1, player2];

    // RANDOMLY ASSIGN PLAYER THAT STARTS PLAYING
    game.#currentPlayer = game.#players[Math.floor(Math.random() * 2)];

    // (!!!!!) DELETE AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
    globals.firstActivePlayerID = game.#currentPlayer.getID();

    // MAIN DECK CONFIGURATION FILE LOAD
    const url = "./src/mainDeck.json";
    const response = await fetch(url);
    const mainDeckConfig = await response.json();
    globals.assetsLoadProgressAsPercentage +=
      100 / (globals.assetsToLoad.length + 2);

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

    game.#chatMessages = [];

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

    // TOOLTIPS
    game.#minionTooltip = new MinionTooltip();
    game.#remainingCardsTooltip = new RemainingCardsTooltip();

    game.#stats = GameStats.create();

    // EVENTS DATA
    game.#eventsData = {
      activeVisibilitySkill: null,
      decrepitThroneSkill: {
        isActive: false,
        playerWithDecrepitThrone: {},
        turnsSinceActivation: 0,
      },
      poisonOfTheAbyss: {
        isActive: false,
        isPlayer1Affected: false,
        isPlayer2Affected: false,
      },
      judgmentAncients: {
        isActive: false,
        affectedPlayerID: -1,
      },
      curseOfTheBoundTitan: {
        isActive: false,
        isPlayer1Affected: false,
        isPlayer2Affected: false,
      },
      theCupOfTheLastBreath: {
        isActive: false,
        isPlayer1Affected: false,
        isPlayer2Affected: false,
      },
      shieldOfBalanceActive: false,
      shieldOfBalanceOwner: null,
    };

    // EDGE ANIMATION
    game.#edgeAnimation = {
      color: null,
      targetBox: null,
      active: false,
    };

    game.#alphaState = {
      alpha: 0.2,
      direction: 1,
    };

    game.#borderTimer = 0;

    game.#particles = [];

    game.#highlightedBoxes = {
      boxes: null,
      color: null,
      isActive: false,
    };

    game.#animationCards = {
      card: null,
      animationTime: 0,
      targetBox: null,
      phase: 0,
      flipProgress: 0,
      time: 0,
      size: 150,
    };

    game.#blinkingAnimation = {
      card: null,
      time: 0,
    };

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
      game.#minionTooltip,
      game.#eventsData,
      game.#stats,
      game.#remainingCardsTooltip,
      game.#edgeAnimation,
      game.#particles,
      game.#highlightedBoxes,
      game.#animationCards,
      game.#blinkingAnimation
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
      game.#minionTooltip,
      game.#eventsData,
      game.#stats,
      game.#remainingCardsTooltip,
      game.#edgeAnimation,
      game.#particles,
      game.#highlightedBoxes,
      game.#animationCards,
      game.#blinkingAnimation
    );
    turnPlayer2.fillPhases(game.#currentPlayer);
    game.#turns = [turnPlayer1, turnPlayer2];

    game.#createPhaseButtons();

    game.#setInitialCardsCoordinates();

    game.#fillActiveEventsTableData();

    game.#particlesForCurrentPlayer();

    checkIfMusicIsPlayingAndIfSoReset();
    setMusic(Music.GAME_MUSIC);

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

          if (currentCard.getID() === MainCharacterID.JOSEPH) {
            smallVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.JOSEPH_SMALL];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.JOSEPH_BIG];
          } else {
            smallVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_SMALL];

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
      const currentButtonYCoordinate = this.#board
        .getGrids()
        [GridType.PHASE_BUTTONS].getBoxes()
        [i].getYCoordinate();

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
    this.#playSound();

    switch (globals.gameState) {
      case GameState.PLAYING:
        this.#updatePlaying();
        break;

      case GameState.CHAT_PAUSE:
        this.#updateChatPause();
        break;
    }
  }

  #playSound() {
    if (globals.currentSound !== Sound.NO_SOUND) {
      // PLAY THE SOUND THAT HAS BEEN INVOKED
      globals.sounds[globals.currentSound].currentTime = 0;
      globals.sounds[globals.currentSound].play();

      // RESET "currentSound"
      globals.currentSound = Sound.NO_SOUND;
    }
  }

  #updatePlaying() {
    if (globals.isCurrentTurnFinished) {
      globals.isCurrentTurnFinished = false;

      this.#stats.incrementPlayedTurns();

      this.#healHarmedMinions();

      if (this.#eventsData.poisonOfTheAbyss.isActive === true) {
        this.#poisonMinions();
      }

      if (this.#eventsData.decrepitThroneSkill.isActive) {
        this.#eventsData.decrepitThroneSkill.turnsSinceActivation++;
      }

      const newCurrentPlayerID = this.#turns[
        this.#currentPlayer.getID()
      ].changeTurn(this.#currentPlayer);

      this.#currentPlayer = this.#players[newCurrentPlayerID];

      this.#phaseMessage.setCurrentContent("");

      const currentPlayerTurnMsg = new StateMessage(
        `${this.#currentPlayer.getName().toUpperCase()}'S TURN`,
        "55px MedievalSharp",
        "yellow",
        1,
        2,
        globals.canvas.width / 2,
        globals.canvas.height / 2,
        1,
        new Physics(0, 0)
      );
      currentPlayerTurnMsg.setVY(20);
      this.#stateMessages.push(currentPlayerTurnMsg);

      // FILL THE CHAT MESSAGES ARRAY
      this.#fillChatMessages();
      this.#particlesForCurrentPlayer();
    }

    if (this.#stateMessages.length === 0 && this.#chatMessages.length > 0) {
      globals.gameState = GameState.CHAT_PAUSE;
      globals.currentSound = Sound.TALKING_SOUND;
    } else if (this.#chatMessages.length === 0) {
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

      this.#turns[this.#currentPlayer.getID()].execute(this.#isGameFinished);

      this.#mouseInput.setLeftButtonPressedFalse();

      this.#executeEvents();

      this.#updatePlayersTotalHP();

      this.#updateParticles();

      this.#checkIfGameOver();
    }

    this.#updateStateMessages();
  }

  #particlesForCurrentPlayer() {
    for (let i = this.#particles.length - 1; i >= 0; i--) {
      if (this.#particles[i].getID() === ParticleID.MAIN_CHARACTER) {
        this.#particles.splice(i, 1);
      }
    }

    let mainCharacterGrid;

    if (this.#currentPlayer.getID() === globals.firstActivePlayerID) {
      mainCharacterGrid =
        this.#board.getGrids()[GridType.PLAYER_1_MAIN_CHARACTER];
    } else {
      mainCharacterGrid =
        this.#board.getGrids()[GridType.PLAYER_2_MAIN_CHARACTER];
    }
    const mainCharacterBox = mainCharacterGrid.getBoxes()[0];
    MainCharacterParticle.create(
      this.#particles,
      40,
      mainCharacterBox,
      this.#currentPlayer.getID()
    );
  }

  #healHarmedMinions() {
    const minionsInPlayDecks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];

    let isPlayer1Antiheal = false;
    let isPlayer1Halfheal = false;
    let isPlayer2Antiheal = false;
    let isPlayer2Halfheal = false;

    if (this.#eventsData.poisonOfTheAbyss.isActive === true) {
      if (this.#eventsData.poisonOfTheAbyss.isPlayer1Affected) {
        isPlayer1Halfheal = true;
      }
      if (this.#eventsData.poisonOfTheAbyss.isPlayer2Affected) {
        isPlayer2Halfheal = true;
      }
    }

    if (this.#eventsData.theCupOfTheLastBreath.isActive === true) {
      if (this.#eventsData.theCupOfTheLastBreath.isPlayer1Affected) {
        isPlayer1Antiheal = true;
      } else if (this.#eventsData.theCupOfTheLastBreath.isPlayer2Affected) {
        isPlayer2Antiheal = true;
      }
    }

    const player1Deck = minionsInPlayDecks[0];
    const player2Deck = minionsInPlayDecks[1];

    for (let i = 0; i < player1Deck.getCards().length; i++) {
      const currentCard = player1Deck.getCards()[i];

      if (
        currentCard.getCurrentHP() < currentCard.getInitialHP() &&
        !isPlayer1Antiheal
      ) {
        let initialHP = currentCard.getInitialHP();
        let currentHP = currentCard.getCurrentHP();

        let healAmount = initialHP - currentHP;

        if (isPlayer1Halfheal) {
          healAmount = Math.floor(healAmount / 2);
          currentCard.setCurrentHP(currentHP + healAmount);

          const healMessage = new StateMessage(
            `+${healAmount} HP`,
            "30px MedievalSharp",
            "lightgreen",
            1,
            2,
            currentCard.getXCoordinate() + 55,
            currentCard.getYCoordinate(),
            1,
            new Physics(0, 0)
          );
          healMessage.setVY(20);
          this.#stateMessages.push(healMessage);
        } else {
          currentCard.setCurrentHP(currentCard.getInitialHP());

          const healMessage = new StateMessage(
            `+${healAmount} HP`,
            "30px MedievalSharp",
            "lightgreen",
            1,
            2,
            currentCard.getXCoordinate() + 55,
            currentCard.getYCoordinate(),
            1,
            new Physics(0, 0)
          );
          healMessage.setVY(20);
          this.#stateMessages.push(healMessage);
        }
      }
    }

    for (let i = 0; i < player2Deck.getCards().length; i++) {
      const currentCard = player2Deck.getCards()[i];

      if (
        currentCard.getCurrentHP() < currentCard.getInitialHP() &&
        !isPlayer2Antiheal
      ) {
        let currentHP = currentCard.getCurrentHP();
        let initialHP = currentCard.getInitialHP();

        let healAmount = initialHP - currentHP;

        if (isPlayer2Halfheal) {
          healAmount = Math.floor(healAmount / 2);
          currentCard.setCurrentHP(currentHP + healAmount);

          const healMessage = new StateMessage(
            `+${healAmount} HP`,
            "30px MedievalSharp",
            "lightgreen",
            1,
            2,
            currentCard.getXCoordinate() + 55,
            currentCard.getYCoordinate(),
            1,
            new Physics(0, 0)
          );
          healMessage.setVY(20);
          this.#stateMessages.push(healMessage);
        } else {
          currentCard.setCurrentHP(currentCard.getInitialHP());

          const healMessage = new StateMessage(
            `+${healAmount} HP`,
            "30px MedievalSharp",
            "lightgreen",
            1,
            2,
            currentCard.getXCoordinate() + 55,
            currentCard.getYCoordinate() + 110,
            1,
            new Physics(0, 0)
          );
          healMessage.setVY(20);
          this.#stateMessages.push(healMessage);
        }
      }
    }
  }

  #poisonMinions() {
    let minionsInPlayDecks = [
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY],
      this.#deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY],
    ];

    if (this.#eventsData.poisonOfTheAbyss.isPlayer2Affected) {
      for (let i = 0; i < minionsInPlayDecks[1].getCards().length; i++) {
        const currentCard = minionsInPlayDecks[1].getCards()[i];

        currentCard.setCurrentHP(currentCard.getCurrentHP() - 5);

        let message = new StateMessage(
          "-5",
          `30px MedievalSharp`,
          "red",
          1,
          2,
          currentCard.getXCoordinate() + 55,
          currentCard.getYCoordinate() + 110,
          1,
          new Physics(0, 0)
        );
        message.setVY(20);
        this.#stateMessages.push(message);
      }
    }

    if (this.#eventsData.poisonOfTheAbyss.isPlayer1Affected) {
      for (let i = 0; i < minionsInPlayDecks[0].getCards().length; i++) {
        const currentCard = minionsInPlayDecks[0].getCards()[i];

        currentCard.setCurrentHP(currentCard.getCurrentHP() - 5);
        let message = new StateMessage(
          "-5",
          `30px MedievalSharp`,
          "red",
          1,
          2,
          currentCard.getXCoordinate() + 55,
          currentCard.getYCoordinate() + 110,
          1,
          new Physics(0, 0)
        );
        message.setVY(20);
        this.#stateMessages.push(message);
      }
    }
  }

  #fillChatMessages() {
    // DETERMINE THE TYPE OF THE CHAT MESSAGE(S) TO DISPLAY

    let randomChatMessageTypeUpperLimit = 2;

    if (
      this.#deckContainer.getDecks()[DeckType.JOSEPH].getCards().length === 1
    ) {
      randomChatMessageTypeUpperLimit = 3;
    }

    const randomChatMessageType = Math.floor(
      Math.random() * randomChatMessageTypeUpperLimit
    );

    // DETERMINE THE SPEAKER(S)

    const speakers = [];
    const positions = [];

    if (randomChatMessageType === ChatMessageType.MAIN_CHARACTERS) {
      const player1MainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_1_MAIN_CHARACTER].getCards()[0];
      const player2MainCharacter = this.#deckContainer
        .getDecks()
        [DeckType.PLAYER_2_MAIN_CHARACTER].getCards()[0];

      speakers.push(player1MainCharacter, player2MainCharacter);

      if (globals.firstActivePlayerID === PlayerID.PLAYER_1) {
        positions.push(ChatMessagePosition.UP, ChatMessagePosition.DOWN);
      } else {
        positions.push(ChatMessagePosition.DOWN, ChatMessagePosition.UP);
      }
    } else if (randomChatMessageType === ChatMessageType.MINIONS) {
      const playersMinionsInPlayCards = [
        this.#deckContainer
          .getDecks()
          [DeckType.PLAYER_1_MINIONS_IN_PLAY].getCards(),
        this.#deckContainer
          .getDecks()
          [DeckType.PLAYER_2_MINIONS_IN_PLAY].getCards(),
      ];

      for (let i = 0; i < playersMinionsInPlayCards.length; i++) {
        const currentPlayerMinionsInPlayCards = playersMinionsInPlayCards[i];

        const randomMinionsInPlayIndex = Math.floor(
          Math.random() * currentPlayerMinionsInPlayCards.length
        );

        const currentPlayerRandomMinionInPlay =
          currentPlayerMinionsInPlayCards[randomMinionsInPlayIndex];

        speakers.push(currentPlayerRandomMinionInPlay);
      }

      if (globals.firstActivePlayerID === PlayerID.PLAYER_1) {
        positions.push(ChatMessagePosition.RIGHT, ChatMessagePosition.LEFT);
      } else {
        positions.push(ChatMessagePosition.LEFT, ChatMessagePosition.RIGHT);
      }
    } else {
      const joseph = this.#deckContainer
        .getDecks()
        [DeckType.JOSEPH].getCards()[0];

      speakers.push(joseph);
    }

    // CREATE AND STORE THE CHAT MESSAGE(S) TO DISPLAY
    if (speakers.length === 1) {
      const chatMessage = ChatMessage.create(
        randomChatMessageType,
        ChatMessagePosition.UP,
        speakers[0].getXCoordinate(),
        speakers[0].getYCoordinate()
      );

      this.#chatMessages.push(chatMessage);
    } else {
      do {
        for (let i = 0; i < speakers.length; i++) {
          const chatMessage = ChatMessage.create(
            randomChatMessageType,
            positions[i],
            speakers[i].getXCoordinate(),
            speakers[i].getYCoordinate()
          );

          this.#chatMessages[i] = chatMessage;
        }
      } while (
        this.#chatMessages[0].getContentAsString() ===
        this.#chatMessages[1].getContentAsString()
      );
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

  #updateParticles() {
    for (let i = 0; i < this.#particles.length; i++) {
      const currentParticle = this.#particles[i];

      currentParticle.update(this.#currentPlayer.getID());

      if (currentParticle.getState() === ParticleState.OFF) {
        this.#particles.splice(i, 1);
        i--;
      }
    }
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
    if (!this.#stats.areStatsAlreadySent()) {
      for (let i = 0; i < this.#players.length; i++) {
        const currentPlayer = this.#players[i];

        if (currentPlayer.getTotalHP() === 0) {
          this.#winner = this.#players[1 - i];

          this.#isGameFinished = true;

          checkIfMusicIsPlayingAndIfSoReset();
          setMusic(Music.WINNER_MUSIC);

          this.#stats.postToDB(this.#winner);
          this.#stats.setStatsAlreadySentToTrue();
        }
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

  #updateChatPause() {
    this.#updateChatMessages();

    if (this.#chatMessages.length === 0) {
      globals.gameState = GameState.PLAYING;
    }

    if (globals.gameState === GameState.CHAT_PAUSE) {
      globals.sounds[globals.currentMusic].volume = 0.2;
    } else {
      globals.sounds[globals.currentMusic].volume = 0.5;
    }
  }

  #updateChatMessages() {
    for (let i = 0; i < this.#chatMessages.length; i++) {
      let currentChatMessage = this.#chatMessages[i];

      const isChatMessageActive = currentChatMessage.execute();

      if (!isChatMessageActive) {
        this.#chatMessages.splice(i, 1);
      }
    }
  }

  #render() {
    // CLEAR SCREEN
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    if (globals.gameState === GameState.LOADING) {
      this.#renderLoadingScreen();
    } else {
      this.#renderGame();

      if (globals.gameState === GameState.CHAT_PAUSE) {
        this.#renderChatMessages();
      }
    }
  }

  #renderLoadingScreen() {
    globals.ctx.fillStyle = "black";
    globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);

    this.#renderLoadingScreenTxt();
    this.#renderLoadingScreenBar();
  }

  #renderLoadingScreenTxt() {
    const canvasWidthDividedBy2 = globals.canvas.width / 2;
    globals.ctx.textAlign = "center";

    globals.ctx.font = "60px MedievalSharp";
    globals.ctx.fillStyle = "rgb(240 240 240)";

    globals.ctx.fillText("LOADING...", canvasWidthDividedBy2, 510);
  }

  #renderLoadingScreenBar() {
    const assetsLoadProgressBarMaxWidth = 500;
    const assetsLoadProgressBarCurrentWidth =
      (globals.assetsLoadProgressAsPercentage / 100) *
      assetsLoadProgressBarMaxWidth;
    const assetsLoadProgressBarHeight = 80;

    const assetsLoadProgressBarXCoordinate =
      globals.canvas.width / 2 - assetsLoadProgressBarMaxWidth / 2;
    const assetsLoadProgressBarYCoordinate = globals.canvas.height / 2;

    globals.ctx.fillStyle = "rgb(240 240 240)";
    globals.ctx.fillRect(
      assetsLoadProgressBarXCoordinate,
      assetsLoadProgressBarYCoordinate,
      assetsLoadProgressBarCurrentWidth,
      assetsLoadProgressBarHeight
    );

    globals.ctx.lineJoin = "bevel";
    globals.ctx.lineWidth = 10;
    globals.ctx.strokeStyle = "rgb(120 120 120)";
    globals.ctx.strokeRect(
      assetsLoadProgressBarXCoordinate,
      assetsLoadProgressBarYCoordinate,
      assetsLoadProgressBarMaxWidth,
      assetsLoadProgressBarHeight
    );
  }

  #renderGame() {
    this.#renderBoard();
    // this.#renderGrids();
    this.#renderPlayersInfo();
    this.#renderPhaseButtons();
    this.#renderActiveEventsTable();
    this.#renderPhaseMessage();
    this.#renderCardsInHandContainers();
    this.#renderCardsReverse();
    this.#renderParticles();
    this.#renderCards();
    this.#renderAnimatedCard();

    if (this.#eventsData.activeVisibilitySkill) {
      this.#eventsData.activeVisibilitySkill.renderVisibilityEffect(
        this.#currentPlayer.getID()
      );
    }

    this.#renderStateMessages();

    if (this.#edgeAnimation.active) {
      this.#renderEdge(
        this.#edgeAnimation.targetBox,
        this.#edgeAnimation.color
      );
    }

    if (this.#highlightedBoxes.isActive) {
      this.#renderHighlightedBoxes(
        this.#highlightedBoxes.boxes,
        this.#highlightedBoxes.color
      );
    }

    if (this.#minionTooltip.hasTooltip()) {
      this.#minionTooltip.render();
    }

    if (this.#remainingCardsTooltip.hasTooltip()) {
      this.#remainingCardsTooltip.render();
    }

    if (this.#attackMenuData.isOpen) {
      this.#renderAttackMenu();
    }

    if (this.#winner) {
      this.#renderGameWinner();
    }
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

  #renderHighlightedBoxes(boxes, color) {
    this.#borderTimer += globals.deltaTime;

    const pulseSpeed = 3;
    const baseWidth = 3;
    const ampWidth = 4;
    const baseAlpha = 0.4;
    const ampAlpha = 0.6;

    const t = this.#borderTimer * pulseSpeed;
    const sine = (Math.sin(t) + 1) / 2;
    const lineWidth = baseWidth + ampWidth * sine;
    const alpha = baseAlpha + ampAlpha * sine;

    globals.ctx.save();
    globals.ctx.globalAlpha = alpha;
    globals.ctx.strokeStyle = color;
    globals.ctx.lineWidth = lineWidth;
    globals.ctx.shadowColor = color;
    globals.ctx.shadowBlur = 10 + 10 * sine;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const x = box.getXCoordinate();
      const y = box.getYCoordinate();
      const width = box.getWidth();
      const height = box.getHeight();

      globals.ctx.strokeRect(x, y, width, height);
    }

    globals.ctx.restore();
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

  #renderEdge(targetBox, highlightColor) {
    if (!targetBox || !this.#edgeAnimation.active || !targetBox.isMouseOver())
      return;

    this.#alphaState.alpha += 0.03 * this.#alphaState.direction;
    if (this.#alphaState.alpha >= 0.8) {
      this.#alphaState.alpha = 0.8;
      this.#alphaState.direction = -1;
    } else if (this.#alphaState.alpha <= 0.2) {
      this.#alphaState.alpha = 0.2;
      this.#alphaState.direction = 1;
    }

    globals.ctx.save();
    globals.ctx.globalAlpha = this.#alphaState.alpha;
    globals.ctx.fillStyle = highlightColor;
    globals.ctx.fillRect(
      targetBox.getXCoordinate() - 5,
      targetBox.getYCoordinate() - 5,
      120,
      120
    );

    globals.ctx.strokeStyle = highlightColor;
    globals.ctx.lineWidth = 3 + this.#alphaState.alpha * 2;
    globals.ctx.strokeRect(
      targetBox.getXCoordinate(),
      targetBox.getYCoordinate(),
      110,
      110
    );

    globals.ctx.restore();
  }

  #renderAnimatedCard() {
    if (
      !this.#animationCards ||
      !this.#animationCards.card ||
      !this.#animationCards.targetBox
    )
      return;

    const card = this.#animationCards.card;
    const centerX = globals.canvas.width / 2 - 70;
    const centerY = globals.canvas.height / 2 - 50;

    const speedToCenter = 0.08;
    const flipDuration = 250;
    const moveSpeed = 0.3;

    if (this.#animationCards.phase === 0) {
      const dx = centerX - card.getXCoordinate();
      const dy = centerY - card.getYCoordinate();

      card.setXCoordinate(card.getXCoordinate() + dx * speedToCenter);
      card.setYCoordinate(card.getYCoordinate() + dy * speedToCenter);

      this.#renderCardReverse(
        card.getXCoordinate(),
        card.getYCoordinate(),
        this.#animationCards.size,
        this.#animationCards.size
      );

      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        card.setXCoordinate(centerX);
        card.setYCoordinate(centerY);
        this.#animationCards.phase = 1;
        this.#animationCards.flipProgress = 0;
      }
    } else if (this.#animationCards.phase === 1) {
      this.#animationCards.flipProgress += globals.deltaTime * 1000;
      const progress = Math.min(
        this.#animationCards.flipProgress / flipDuration,
        1
      );
      const scaleX = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2;
      this.#animationCards.size = 150 - 40 * progress;

      globals.ctx.save();
      globals.ctx.translate(
        centerX + this.#animationCards.size / 2,
        centerY + this.#animationCards.size / 2
      );
      globals.ctx.scale(scaleX, 1);
      globals.ctx.translate(
        -(centerX + this.#animationCards.size / 2),
        -(centerY + this.#animationCards.size / 2)
      );

      if (progress < 0.5) {
        this.#renderCardReverse(
          centerX,
          centerY,
          this.#animationCards.size,
          this.#animationCards.size
        );
      } else if (scaleX > 0.01) {
        this.#renderCard(
          card,
          centerX,
          centerY,
          this.#animationCards.size,
          this.#animationCards.size
        );
      }

      globals.ctx.restore();

      if (progress >= 1) {
        this.#animationCards.phase = 2;
      }
    } else if (this.#animationCards.phase === 2) {
      const targetBox = this.#animationCards.targetBox;
      const tx = targetBox.getXCoordinate();
      const ty = targetBox.getYCoordinate();

      const dx = tx - card.getXCoordinate();
      const dy = ty - card.getYCoordinate();

      card.setXCoordinate(card.getXCoordinate() + dx * moveSpeed);
      card.setYCoordinate(card.getYCoordinate() + dy * moveSpeed);

      this.#renderCard(card);

      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        card.setXCoordinate(tx);
        card.setYCoordinate(ty);
        card.setState(CardState.PLACED);
        targetBox.setCard(card);

        this.#animationCards.card = null;
        this.#animationCards.animationTime = 0;
        this.#animationCards.targetBox = null;
        this.#animationCards.phase = 0;
        this.#animationCards.flipProgress = 0;
      }
    }
  }

  #renderPhaseButtons() {
    globals.ctx.shadowBlur = 10;
    globals.ctx.shadowColor = "black";

    const numOfExecutedPhases =
      this.#turns[this.#currentPlayer.getID()].getNumOfExecutedPhases();
    const TOTAL_PHASES = 5;

    const phaseText = `Phase: ${numOfExecutedPhases + 1}/${TOTAL_PHASES}`;

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "24px MedievalSharp";
    globals.ctx.fillStyle = "white";
    globals.ctx.fillText(phaseText, 500, 705);

    for (let i = 0; i < globals.buttonDataGlobal.length; i++) {
      const currentButton = globals.buttonDataGlobal[i];

      globals.ctx.drawImage(
        globals.phaseButtonImage,
        0,
        0,
        950,
        519,
        currentButton[PhaseButtonData.X_COORDINATE],
        currentButton[PhaseButtonData.Y_COORDINATE],
        currentButton[PhaseButtonData.WIDTH],
        currentButton[PhaseButtonData.HEIGHT]
      );

      globals.ctx.font = "18px MedievalSharp";
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

    globals.ctx.shadowBlur = 10;
    globals.ctx.shadowColor = "rgba(0 0 0)";

    globals.ctx.drawImage(
      globals.activeEventsTableImage,
      0,
      0,
      916,
      714,
      tableX,
      tableY,
      tableWidth,
      tableHeight
    );

    this.#renderColumnAndRowLinesAndHeaders(
      tableY,
      tableX,
      tableWidth,
      tableHeight
    );

    this.#renderActiveEventsData();
  }

  #renderColumnAndRowLinesAndHeaders(tableY, tableX, tableWidth, tableHeight) {
    globals.ctx.strokeStyle = "rgb(1 15 28)";
    globals.ctx.lineWidth = 2;

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "18px MedievalSharp";
    globals.ctx.fillStyle = "white";

    const isJosephChaoticEventActive =
      this.#deckContainer.getDecks()[DeckType.JOSEPH].getCards().length === 1;
    this.#activeEventsTableData.rows[3].header = isJosephChaoticEventActive
      ? "Joseph"
      : "...";

    for (let i = 0; i < this.#activeEventsTableData.rows.length; i++) {
      const currentColumn = this.#activeEventsTableData.columns[i];

      if (i !== this.#activeEventsTableData.rows.length - 1) {
        // COLUMN LINE
        globals.ctx.shadowBlur = 0;
        globals.ctx.beginPath();
        globals.ctx.moveTo(currentColumn.lineXCoordinate, tableY);
        globals.ctx.lineTo(currentColumn.lineXCoordinate, tableY + tableHeight);
        globals.ctx.stroke();

        // COLUMN HEADER
        globals.ctx.shadowBlur = 10;
        globals.ctx.fillText(
          currentColumn.header,
          currentColumn.lineXCoordinate - currentColumn.width / 2,
          tableY + this.#activeEventsTableData.rows[0].height / 2
        );
      }

      const currentRow = this.#activeEventsTableData.rows[i];

      // ROW LINE
      globals.ctx.shadowBlur = 0;
      globals.ctx.beginPath();
      globals.ctx.moveTo(tableX, currentRow.lineYCoordinate);
      globals.ctx.lineTo(tableX + tableWidth, currentRow.lineYCoordinate);
      globals.ctx.stroke();

      // ROW HEADER
      globals.ctx.shadowBlur = 10;
      globals.ctx.fillText(
        currentRow.header,
        tableX + this.#activeEventsTableData.columns[0].width / 2,
        currentRow.lineYCoordinate - currentRow.height / 2
      );
    }

    globals.ctx.shadowBlur = 0;
  }

  #renderActiveEventsData() {
    globals.ctx.fillStyle = "white";
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
    globals.ctx.save();

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

    globals.ctx.shadowBlur = 10;
    globals.ctx.shadowColor = "black";

    globals.ctx.drawImage(
      globals.phaseMsgsBoardImage,
      0,
      0,
      1452,
      706,
      messageBoxX,
      messageBoxY,
      messageBoxWidth,
      messageBoxHeight
    );

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.fillStyle = "white";

    globals.ctx.fillText(
      this.#phaseMessage.getCurrentContent(),
      messageBoxX + messageBoxWidth / 2,
      messageBoxY + messageBoxHeight / 2
    );

    globals.ctx.restore();
  }

  #renderCardsInHandContainers() {
    const cardsInHandContainersCoordinates = [
      {
        xCoordinate: 661,
        yCoordinate: -8,
      },
      {
        xCoordinate: 661,
        yCoordinate: 952,
      },
    ];

    const CARDS_IN_HAND_CONTAINERS_WIDTH = 1058;
    const CARDS_IN_HAND_CONTAINERS_HEIGHT = 177;

    for (let i = 0; i < cardsInHandContainersCoordinates.length; i++) {
      const currentCardsInHandContainer = cardsInHandContainersCoordinates[i];

      globals.ctx.drawImage(
        globals.cardsInHandContainerImage,
        0,
        0,
        1280,
        512,
        currentCardsInHandContainer.xCoordinate,
        currentCardsInHandContainer.yCoordinate,
        CARDS_IN_HAND_CONTAINERS_WIDTH,
        CARDS_IN_HAND_CONTAINERS_HEIGHT
      );
    }
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
      848,
      928,
      xCoordinate,
      yCoordinate,
      width,
      height
    );
  }

  #renderCards() {
    let expandedCard;
    let movingCard;
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

          if (currentCard.getState() === CardState.REVEALING_AND_MOVING) {
            continue;
          }

          if (currentCard.getState() === CardState.MOVING) {
            movingCard = currentCard;
            continue;
          }

          if (
            currentCard.getState() === CardState.SELECTED &&
            !isDeckCardsInHandOfInactivePlayer
          ) {
            if (currentCard !== movingCard) {
              this.#renderSelectedCardEffect(currentCard);
            }
          }

          let shouldRenderCard = true;
          if (
            this.#blinkingAnimation.card &&
            currentCard === this.#blinkingAnimation.card
          ) {
            this.#blinkingAnimation.time += globals.deltaTime * 1000;

            if (this.#blinkingAnimation.time >= 1000) {
              this.#blinkingAnimation.card = null;
              this.#blinkingAnimation.time = 0;
            } else {
              const blinkOn =
                Math.floor(this.#blinkingAnimation.time / 200) % 2 === 0;
              shouldRenderCard = blinkOn;
            }
          }

          if (shouldRenderCard) {
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
          }

          if (currentCard.getState() === CardState.EXPANDED) {
            expandedCard = currentCard;
          }
        }
      }
    }

    if (movingCard) {
      this.#renderCard(movingCard);
    }

    if (expandedCard) {
      this.#renderExpandedCard(expandedCard);
    }
  }

  #renderSelectedCardEffect(card) {
    this.#borderTimer += globals.deltaTime;

    const x = card.getXCoordinate();
    const y = card.getYCoordinate();
    const w = globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const h =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

    const P = 2 * (w + h);
    const num = 24;
    const margin = 6;

    const categoryColors = {
      [CardCategory.ARMOR]: { h: 120, s: 90, l: 65 },
      [CardCategory.MINION]: { h: 200, s: 80, l: 60 },
      [CardCategory.RARE]: { h: 280, s: 90, l: 70 },
      [CardCategory.SPECIAL]: { h: 50, s: 100, l: 65 },
      [CardCategory.WEAPON]: { h: 0, s: 85, l: 60 },
    };
    const col = categoryColors[card.getCategory()] || { h: 0, s: 0, l: 50 };
    const fill = `hsl(${col.h}, ${col.s}%, ${Math.min(100, col.l + 10)}%)`;
    const shadow = fill;

    globals.ctx.save();
    globals.ctx.globalAlpha = 1.0;
    globals.ctx.fillStyle = fill;
    globals.ctx.shadowColor = shadow;
    globals.ctx.shadowBlur = 4;

    for (let i = 0; i < num; i++) {
      const t = (i / num) * P;
      let px, py;
      if (t < w) {
        px = x + t;
        py = y - margin;
      } else if (t < w + h) {
        px = x + w + margin;
        py = y + (t - w);
      } else if (t < 2 * w + h) {
        px = x + (2 * w + h - t);
        py = y + h + margin;
      } else {
        px = x - margin;
        py = y + (P - t);
      }

      const size = 3 + 1.2 * Math.sin(this.#borderTimer * 3 + i);

      globals.ctx.beginPath();
      globals.ctx.arc(px, py, size, 0, Math.PI * 2);
      globals.ctx.fill();
    }

    globals.ctx.restore();
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

    globals.ctx.fillText("SE", xCoordinate, yCoordinate + 59);
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 111
    );
    globals.ctx.fillText(
      card.getCurrentDurability(),
      xCoordinate + 110,
      yCoordinate + 59
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

    globals.ctx.fillText("EF", xCoordinate, yCoordinate + 60);
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 111
    );
    globals.ctx.fillText(
      card.getCurrentDurationInRounds(),
      xCoordinate + 110,
      yCoordinate + 59
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

    globals.ctx.fillText("EF", xCoordinate, yCoordinate + 60);
    globals.ctx.fillText(0, xCoordinate + 55, yCoordinate + 111);
    globals.ctx.fillText(
      card.getCurrentDurationInRounds(),
      xCoordinate + 110,
      yCoordinate + 59
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
    globals.ctx.fillStyle = "rgb(248, 231, 199)";
    globals.ctx.font = "28px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 303);

    globals.ctx.fillStyle = "rgb(189, 243, 231)";
    globals.ctx.font = "14px MedievalSharp";

    card.renderDescription();
    card.renderChaoticEventDescription();
  }

  #renderExpandedMainCharacter(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.fillStyle = "rgb(255, 228, 171)";
    globals.ctx.font = "24px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 291);

    globals.ctx.font = "16px MedievalSharp";

    card.renderDescription();
    card.renderSpecialSkill();
  }

  #renderExpandedMinion(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE
        x: 1042,
        y: 271,
        width: 40,
        height: 40,
      },
      {
        // HP
        x: 1045,
        y: 789,
        width: 50,
        height: 50,
      },
      {
        // MADNESS
        x: 1130,
        y: 793,
        width: 42,
        height: 42,
      },
      {
        // ATTACK
        x: 1215,
        y: 797,
        width: 34,
        height: 34,
      },
      {
        // DEFENSE
        x: 1290,
        y: 793,
        width: 41,
        height: 40,
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

    card.renderDescription();

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 19, 292);
    globals.ctx.fillText(card.getInitialHP(), 1070, 852);
    globals.ctx.fillText(card.getInitialMadness(), 1151, 852);
    globals.ctx.fillText(card.getInitialAttack(), 1231, 852);
    globals.ctx.fillText(card.getInitialDefense(), 1311, 852);
  }

  #renderExpandedWeapon(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1024,
        y: 263,
        width: 31,
        height: 31,
      },
      {
        // TYPE
        x: 1030,
        y: 269,
        width: 20,
        height: 20,
      },
      {
        // DAMAGE
        x: 1040,
        y: 820,
        width: 43,
        height: 43,
      },
      {
        // DURABILITY
        x: 1147,
        y: 810,
        width: 63,
        height: 63,
      },
      {
        // PREPARATION TIME
        x: 1270,
        y: 816,
        width: 50,
        height: 50,
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

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 16, 281);
    card.renderDescription();

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getInitialDamage(), 1104, 843);
    globals.ctx.fillText(card.getInitialDurability(), 1219, 843);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1335, 843);
  }

  #renderExpandedArmor(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1024,
        y: 263,
        width: 31,
        height: 31,
      },
      {
        // TYPE
        x: 1030,
        y: 268,
        width: 20,
        height: 20,
      },
      {
        // DURABILITY
        x: 1068,
        y: 815,
        width: 60,
        height: 60,
      },
      {
        // PREPARATION TIME
        x: 1217,
        y: 821,
        width: 47,
        height: 47,
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

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 16, 281);

    globals.ctx.font = "18px MedievalSharp";

    card.renderDescription();
    card.renderSpecialEffect();
    globals.ctx.fillText(card.getInitialDurability(), 1140, 847);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1281, 847);
  }

  #renderExpandedSpecial(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1025,
        y: 269,
        width: 40,
        height: 40,
      },
      {
        // TYPE
        x: 1028,
        y: 271,
        width: 35,
        height: 35,
      },
      {
        // PREPARATION TIME
        x: 1084,
        y: 823,
        width: 47,
        height: 47,
      },
      {
        // DURATION
        x: 1227,
        y: 828,
        width: 38,
        height: 38,
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

    card.renderDescription();
    card.renderEffect();

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 17, 290);
    globals.ctx.fillText(card.getInitialPrepTimeInRounds(), 1148, 848);
    globals.ctx.fillText(card.getInitialDurationInRounds(), 1280, 848);
  }

  #renderExpandedRare(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // TYPE CIRCLE
        x: 1025,
        y: 270,
        width: 40,
        height: 40,
      },
      {
        // TYPE
        x: 1031,
        y: 276,
        width: 28,
        height: 28,
      },
      {
        // PREPARATION TIME
        x: 1084,
        y: 823,
        width: 47,
        height: 47,
      },
      {
        // DURATION
        x: 1227,
        y: 828,
        width: 38,
        height: 38,
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

    card.renderDescription();
    card.renderEffect();

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 18, 291);
    globals.ctx.fillText(0, 1148, 848);
    globals.ctx.fillText(card.getInitialDurationInRounds(), 1280, 848);
  }

  #renderParticles() {
    for (let i = 0; i < this.#particles.length; i++) {
      const currentParticle = this.#particles[i];

      currentParticle.render();
    }
  }

  #renderStateMessages() {
    globals.ctx.save();

    for (let i = 0; i < this.#stateMessages.length; i++) {
      const currentMessage = this.#stateMessages[i];

      globals.ctx.shadowBlur = 20;
      globals.ctx.shadowColor = "black";
      globals.ctx.font = currentMessage.getFont();
      globals.ctx.fillStyle = currentMessage.getColor();
      globals.ctx.globalAlpha = currentMessage.getAlpha();

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

    const gameWinnerName = this.#winner.getName().toUpperCase();
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

  #renderChatMessages() {
    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.fillStyle = "black";

    for (let i = 0; i < this.#chatMessages.length; i++) {
      const currentChatMessage = this.#chatMessages[i];

      globals.ctx.save();

      if (currentChatMessage.getPosition() === ChatMessagePosition.DOWN) {
        globals.ctx.scale(1, -1);
      } else if (
        currentChatMessage.getPosition() === ChatMessagePosition.LEFT
      ) {
        globals.ctx.scale(-1, 1);
      }

      globals.ctx.drawImage(
        globals.balloonsImages[currentChatMessage.getType()],
        0,
        0,
        500,
        300,
        currentChatMessage.getBalloonXCoordinate(),
        currentChatMessage.getBalloonYCoordinate(),
        currentChatMessage.getBalloonWidth(),
        currentChatMessage.getBalloonHeight()
      );

      globals.ctx.restore();

      currentChatMessage.renderContent();
    }
  }
}
