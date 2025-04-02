import Player from "./Player.js";
import CardView from "../Decks/CardView.js";
import Deck from "../Decks/Deck.js";
import DeckCreator from "../Decks/DeckCreator.js";
import GridCreator from "../Board/GridCreator.js";
import Turn from "../Turns/Turn.js";
import MouseInput from "./MouseInput.js";
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
  PhaseType,
  PhaseButtonData,
  BoxState,
} from "./constants.js";
import { globals } from "../index.js";
import ImageSet from "./ImageSet.js";

export default class Game {
  #players;
  #currentPlayer;
  #deckContainer;
  #board;
  #turns;
  #mouseInput;
  #events;
  #currentPhase;
  #phaseMessage;

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

    // TURNS CREATION
    const turnPlayer1 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_1],
      game.#events,
      game.#phaseMessage
    );
    turnPlayer1.fillPhases(game.#currentPlayer);
    const turnPlayer2 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_2],
      game.#events,
      game.#phaseMessage
    );
    turnPlayer2.fillPhases(game.#currentPlayer);
    game.#turns = [turnPlayer1, turnPlayer2];

    game.#createPhaseButtons();

    game.#setInitialCardsCoordinates();

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
          cardImage = globals.cardsImages.mainCharacters[currentCard.getID()];

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
                // globals.cardsIconsImages[IconID.WEAPON_HYBRID_TYPE],
                // globals.cardsIconsImages[IconID.WEAPON_MISSILE_TYPE],
                // globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE],
                // globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE],
                // globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE],
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
            cardImage = globals.cardsImages.specialEvents[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.SPECIAL_EVENTS_BIG];

            cardTypeIcon = globals.cardsIconsImages[IconID.SPECIAL_TYPE];
          } else {
            cardImage = globals.cardsImages.rareEvents[currentCard.getID()];

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

        let currentCardsInHandBoxIndex = j;
        if (
          currentPlayer.cardsInHandGrid ===
          this.#board.getGrids()[GridType.PLAYER_2_CARDS_IN_HAND]
        ) {
          currentCardsInHandBoxIndex = j;
        }
        const currentCardsInHandBox =
          currentPlayer.cardsInHandGrid.getBoxes()[currentCardsInHandBoxIndex];
        currentCardsInHandBox.setCard(currentEventCard);
        currentCardsInHandBox.setState(BoxState.OCCUPIED);

        currentEventCard.setXCoordinate(currentCardsInHandBox.getXCoordinate());
        currentEventCard.setYCoordinate(currentCardsInHandBox.getYCoordinate());
      }

      // SET COORDINATES OF MINIONS IN PLAY
      for (let j = 0; j < 3; j++) {
        const currentMinionCard = currentPlayer.minionsInPlayDeck.getCards()[j];

        let currentBattlefieldBoxIndex = j + 1;
        if (
          currentPlayer.minionsInPlayGrid ===
          this.#board.getGrids()[GridType.PLAYER_1_BATTLEFIELD]
        ) {
          currentBattlefieldBoxIndex = j + 2;
        }
        const currentBattlefieldBox =
          currentPlayer.minionsInPlayGrid.getBoxes()[
            currentBattlefieldBoxIndex
          ];
        currentBattlefieldBox.setCard(currentMinionCard);

        currentMinionCard.setXCoordinate(
          currentBattlefieldBox.getXCoordinate()
        );
        currentMinionCard.setYCoordinate(
          currentBattlefieldBox.getYCoordinate()
        );

        if (
          currentMinionCard.getXCoordinate() ===
            currentBattlefieldBox.getXCoordinate() &&
          currentMinionCard.getYCoordinate() ===
            currentBattlefieldBox.getYCoordinate()
        ) {
          currentBattlefieldBox.setCard(currentMinionCard);
        }
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

      const newCurrentPlayerID = this.#turns[
        this.#currentPlayer.getID()
      ].changeTurn(this.#currentPlayer);

      this.#currentPlayer = this.#players[newCurrentPlayerID];
    }

    if (!globals.gameWinner) {
      this.#turns[this.#currentPlayer.getID()].execute();
    }

    this.#executeEvent();

    this.#updateDamageMessages();

    this.#mouseInput.resetIsLeftClickedOnBoxes(this.#board);
    this.#mouseInput.detectMouseOverBox(this.#board);
    this.#mouseInput.detectBoxThatIsntHoveredAnymore(this.#board);
    this.#mouseInput.detectLeftClickOnBox(this.#board);

    this.#mouseInput.resetIsLeftClickedOnCards(this.#deckContainer);
    this.#mouseInput.detectMouseOverCard(this.#deckContainer);
    this.#mouseInput.detectCardThatIsntHoveredAnymore(this.#deckContainer);
    this.#mouseInput.detectLeftClickOnCard(this.#deckContainer);

    this.#updatePlayersTotalHP();

    this.#updateMessages();

    this.#checkIfGameOver();
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

  #updateMessages() {
    if (globals.phasesMessages.length > 1) {
      globals.phasesMessages.slice(0, 1);
    }
  }

  #executeEvent() {
    for (let i = 0; i < this.#events.length; i++) {
      let event = this.#events[i];
      event.execute(this.#currentPlayer);

      if (!event.isActive()) {
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

  #updateDamageMessages() {
    for (let i = 0; i < globals.damageMessages.length; i++) {
      let message = globals.damageMessages[i];

      let isFisished = message.execute();
      if (isFisished) {
        globals.damageMessages.splice(i, 1);
      }
    }
  }

  #render() {
    // CLEAR SCREEN
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    switch (globals.gameState) {
      case GameState.PLAYING:
        this.#renderGame();

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
    this.#renderMessages();
    this.#renderCardsReverse();
    this.#renderCards();
    this.#renderDamageMessages();
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

    globals.ctx.strokeStyle = "black";
    globals.ctx.lineWidth = 2;

    let columnWidth = tableWidth / 3;

    for (let i = 1; i <= 2; i++) {
      let columnX = tableX + columnWidth * i;
      globals.ctx.beginPath();
      globals.ctx.moveTo(columnX, tableY);
      globals.ctx.lineTo(columnX, tableY + tableHeight);
      globals.ctx.stroke();
    }

    let lineY = tableY + (tableHeight / 4) * 1;
    globals.ctx.beginPath();
    globals.ctx.moveTo(tableX, lineY);
    globals.ctx.lineTo(tableX + tableWidth, lineY);
    globals.ctx.stroke();

    globals.ctx.fillStyle = "white";
    globals.ctx.font = "18px MedievalSharp";
    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";

    globals.ctx.fillText(
      "Player",
      tableX + columnWidth / 2,
      tableY + tableHeight / 8
    );
    globals.ctx.fillText(
      "Event",
      tableX + columnWidth * 1.5,
      tableY + tableHeight / 8
    );
    globals.ctx.fillText(
      "Duration",
      tableX + columnWidth * 2.5,
      tableY + tableHeight / 8
    );

    globals.ctx.fillStyle = "black";
    globals.ctx.fillText(
      "Player 2",
      tableX + columnWidth / 2,
      tableY + tableHeight - 185
    );
    globals.ctx.fillText(
      "Hand of God",
      tableX + columnWidth * 1.5,
      tableY + tableHeight - 185
    );
    globals.ctx.fillText(
      "2 rounds",
      tableX + columnWidth * 2.5,
      tableY + tableHeight - 185
    );
  }

  #renderMessages() {
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

    for (let i = 0; i < globals.phasesMessages.length; i++) {
      let messages = globals.phasesMessages[i];
      let phaseType = this.#getPhaseType(globals.currentPhase);
      let messageContent = messages.getContent(
        phaseType,
        globals.currentState,
        "ENG"
      );
      globals.ctx.fillText(
        messageContent,
        messageBoxX + messageBoxWidth / 2,
        messageBoxY + messageBoxHeight / 2
      );
    }
  }

  #getPhaseType(currentPhase) {
    switch (currentPhase) {
      case PhaseType.INVALID:
        return PhaseType.INVALID;
      case PhaseType.PREPARE_EVENT:
        return PhaseType.PREPARE_EVENT;
      case PhaseType.ATTACK:
        return PhaseType.ATTACK;
      case PhaseType.MOVE:
        return PhaseType.MOVE;
      case PhaseType.EQUIP_WEAPON:
        return PhaseType.EQUIP_WEAPON;
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
    const player1Deck =
      this.#deckContainer.getDecks()[DeckType.PLAYER_1_CARDS_IN_HAND];
    for (let i = 0; i < player1Deck.getCards().length; i++) {
      const currentCard = player1Deck.getCards()[i];
      if (currentCard.getState() === CardState.EXPANDED) {
        expandedCard = currentCard;
      }
    }

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
        currentDeck.getDeckType() !== DeckType.PLAYER_1_ACTIVE_EVENTS &&
        currentDeck.getDeckType() !== DeckType.PLAYER_1_MINIONS &&
        currentDeck.getDeckType() !== DeckType.PLAYER_2_MINIONS
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

    // RENDER ICONS

    const icons = card.getImageSet().getIcons().smallVersion;

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
    ];

    if (card.getWeapon()) {
      iconsPositions.push(
        {
          // (WEAPON) TYPE CIRCLE
          x: xCoordinate - 17,
          y: yCoordinate - 17,
          width: 35,
          height: 35,
        },
        {
          // (WEAPON) TYPE
          x: xCoordinate - 10,
          y: yCoordinate - 10,
          width: 20,
          height: 20,
        }
      );
    }

    let numOfIconsToRender = iconsPositions.length;

    for (let i = 0; i < numOfIconsToRender; i++) {
      const { x, y, width, height } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    // CURRENT HP
    globals.ctx.fillText(
      card.getCurrentHP(),
      xCoordinate + 55,
      yCoordinate + 111
    );

    // CURRENT ATTACK

    let numOfTimesToFillText = 1;

    let currentAttackToRender = card.getCurrentAttack();

    if (card.getWeapon()) {
      numOfTimesToFillText = 7;

      currentAttackToRender += card.getWeaponCurrentDamage();
      globals.ctx.shadowBlur = 5;
      globals.ctx.shadowColor = "rgb(255 0 0 / 0.25)";
    }

    for (let i = 0; i < numOfTimesToFillText; i++) {
      globals.ctx.fillText(
        currentAttackToRender,
        xCoordinate,
        yCoordinate + 59
      );
    }

    globals.ctx.shadowBlur = 0;
    globals.ctx.shadowColor = "transparent";

    // CURRENT DEFENSE
    globals.ctx.fillText(
      card.getCurrentDefense(),
      xCoordinate + 110,
      yCoordinate + 59
    );
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
    globals.ctx.fillText(
      `Chaotic Event: ${card.getChaoticEventName()}`,
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
    globals.ctx.fillText("Special Skill:", canvasWidthDividedBy2, 760);
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
        width: 25,
        height: 25,
      },
      {
        // MADNESS
        x: 1147,
        y: 750,
        width: 25,
        height: 25,
      },
      {
        // ATTACK
        x: 1200,
        y: 752,
        width: 20,
        height: 20,
      },
      {
        // DEFENSE
        x: 1250,
        y: 750,
        width: 25,
        height: 25,
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
        specialEffectUsableBy = "Warriors";
      } else {
        specialEffectUsableBy = "Wizards";
      }

      globals.ctx.fillText(
        `Special Effect Usable by ${specialEffectUsableBy}:`,
        canvasWidthDividedBy2,
        715
      );

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
    globals.ctx.fillText("Effect:", canvasWidthDividedBy2, 730);
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
    globals.ctx.fillText("Effect:", canvasWidthDividedBy2, 730);
    globals.ctx.fillText(card.getEffect(), canvasWidthDividedBy2, 750);
    globals.ctx.fillText(0, 1110, 785);
    globals.ctx.fillText(card.getInitialDurationInRounds(), 1180, 785);

    globals.ctx.font = "18px MedievalSharp";

    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 670);
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

  #renderDamageMessages() {
    for (let i = 0; i < globals.damageMessages.length; i++) {
      let message = globals.damageMessages[i];
      let duration = message.getDuration();

      let fontSize = globals.damageFontSize / duration;
      if (fontSize >= 100) {
        fontSize = 100;
      }

      globals.ctx.font = `${fontSize}px MedievalSharp`;
      globals.ctx.fillStyle = "red";
      globals.ctx.fillText(
        message.getContent(),
        message.getXPosition(),
        message.getYPosition()
      );
    }
  }
}
