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
  WeaponType,
  ArmorType,
  MinionType,
  IconID,
  TemplateID,
  PlayerID,
  CardState,
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

  static async create() {
    // "game" OBJECT CREATION
    const game = new Game();

    // PLAYERS CREATION
    const player1 = new Player(
      PlayerID.PLAYER_1,
      "Player 1",
      100 /* TO BE CHANGED, THIS IS "FAKE" DATA */
    );
    const player2 = new Player(
      PlayerID.PLAYER_2,
      "Player 2",
      100 /* TO BE CHANGED, THIS IS "FAKE" DATA */
    );
    game.#players = [player1, player2];

    // RANDOMLY ASSIGN PLAYER THAT STARTS PLAYING
    game.#currentPlayer = Math.floor(Math.random() * 2);

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

    // TURNS CREATION
    const turnPlayer1 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_1]
    );
    turnPlayer1.fillPhases();
    const turnPlayer2 = new Turn(
      game.#deckContainer,
      game.#board,
      game.#mouseInput,
      game.#players[PlayerID.PLAYER_2]
    );
    turnPlayer2.fillPhases();
    game.#turns = [turnPlayer1, turnPlayer2];

    return game;
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {
    if (globals.isCurrentTurnFinished) {
      globals.isCurrentTurnFinished = false;

      this.#currentPlayer = this.#turns[this.#currentPlayer].changeTurn(
        this.#currentPlayer
      );
    }

    this.#turns[this.#currentPlayer].execute();
  }

  #render() {
    // CLEAR SCREEN
    globals.ctx.clearRect(0, 0, globals.canvas.width, globals.canvas.height);

    this.#renderBoard();

    switch (globals.gameState) {
      case GameState.GRIDS_DRAWING:
        this.#renderGrids();
        break;

      case GameState.PLAYING:
        this.#renderGame();
        break;
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

  #renderGame() {
    this.#renderCards();
  }

  #renderCards() {
    let xCoordinate = 0;
    let expandedCard;

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        if (currentCard.getCategory() === CardCategory.MINION) {
          currentCard.setXCoordinate(xCoordinate);
          xCoordinate += 150;
          this.#renderCard(currentCard);

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

  #renderMainCharacter(card) {
    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.mainCharactersSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.mainCharactersSmallVersion.height;

    // RENDER THE CARD IMAGE
    globals.ctx.drawImage(
      card.getImageSet().getCard(),
      0,
      0,
      1024,
      1024,
      card.getXCoordinate(),
      card.getYCoordinate(),
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
      card.getXCoordinate(),
      card.getYCoordinate(),
      cardAndTemplateWidth,
      cardAndTemplateHeight
    );
  }

  #renderMinion(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

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

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        // TYPE
        x: xCoordinate + 37,
        y: yCoordinate - 17,
      },
      {
        // ATTACK
        x: xCoordinate - 17,
        y: yCoordinate + 40,
      },
      {
        // HP
        x: xCoordinate + 37,
        y: yCoordinate + 92,
      },
      {
        // DEFENSE
        x: xCoordinate + 92,
        y: yCoordinate + 40,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 35, 35);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getCurrentAttack(),
      xCoordinate,
      yCoordinate + 58
    );
    globals.ctx.fillText(
      card.getCurrentHP(),
      xCoordinate + 55,
      yCoordinate + 110
    );
    globals.ctx.fillText(
      card.getCurrentDefense(),
      xCoordinate + 110,
      yCoordinate + 58
    );
  }

  #renderWeapon(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

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

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        //DAMAGE
        x: xCoordinate - 17,
        y: yCoordinate - 17,
      },
      {
        //DURABILITY
        x: xCoordinate + 20,
        y: yCoordinate - 37,
      },
      {
        //PREPARATION TIME
        x: xCoordinate + 25,
        y: yCoordinate - 40,
      },
    ];

    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 35, 35);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getCurrentDamage(),
      xCoordinate + 5,
      yCoordinate + 58
    );
    globals.ctx.fillText(
      card.getCurrentDurability(),
      xCoordinate + 55,
      yCoordinate + 110
    );
    globals.ctx.fillText(
      card.getCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 110
    );
  }

  #renderArmor(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

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

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        //DURABILITY
        x: xCoordinate + 25,
        y: yCoordinate - 37,
      },
      {
        //PREPARATION TIME
        x: xCoordinate + 25,
        y: yCoordinate - 45,
      },
    ];

    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 35, 35);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getCurrentArmorDurability(),
      xCoordinate + 5,
      yCoordinate + 58
    );
    globals.ctx.fillText(
      card.getCurrentArmorPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 110
    );
  }

  #renderSpecial(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

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

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        //DURATION
        x: xCoordinate + 25,
        y: yCoordinate - 37,
      },
      {
        //PREPARATION TIME
        x: xCoordinate + 25,
        y: yCoordinate - 45,
      },
    ];

    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 35, 35);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getSpecialCurrentDurationInRounds(),
      xCoordinate + 5,
      yCoordinate + 58
    );
    globals.ctx.fillText(
      card.getSpecialCurrentPrepTimeInRounds(),
      xCoordinate + 55,
      yCoordinate + 110
    );
  }

  #renderRare(card) {
    const xCoordinate = card.getXCoordinate();
    const yCoordinate = card.getYCoordinate();

    const cardAndTemplateWidth =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.width;
    const cardAndTemplateHeight =
      globals.imagesDestinationSizes.minionsAndEventsSmallVersion.height;

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

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().smallVersion;
    const iconsPositions = [
      {
        //DURATION
        x: xCoordinate + 15,
        y: yCoordinate - 27,
      },
    ];

    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 35, 35);
    }

    // RENDER ATTRIBUTES VALUES

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "14px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(
      card.getRareCurrentDurationInRounds(),
      xCoordinate + 15,
      yCoordinate + 20
    );
  }

  #renderExpandedCard(expandedCard) {
    switch (expandedCard.getCategory()) {
      case CardCategory.MAIN_CHARACTER:
        this.#renderExpandedMainCharacter(expandedCard);
        break;

      case CardCategory.MINION:
        this.#renderExpandedMinion(expandedCard);
        break;

      case CardCategory.WEAPON:
        this.#renderExpandedWeapon(expandedCard);
        break;

      // case CardCategory.ARMOR:
      //   this.#renderExpandedArmor(expandedCard);
      //   break;

      // case CardCategory.SPECIAL:
      //   this.#renderExpandedSpecial(expandedCard);
      //   break;

      // case CardCategory.RARE:
      //   this.#renderExpandedRare(expandedCard);
      //   break;
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

  #renderExpandedMainCharacter(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.font = "24px MedievalSharp";
    globals.ctx.fillStyle = "white";

    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);
    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
    globals.ctx.fillText("Special Skill", canvasWidthDividedBy2, 620);
    globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 640);
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
        x: 1060,
        y: 758,
        width: 35,
        height: 35,
      },
      {
        // MADNESS
        x: 1130,
        y: 758,
        width: 35,
        height: 35,
      },
      {
        // ATTACK
        x: 1195,
        y: 758,
        width: 35,
        height: 35,
      },
      {
        // DEFENSE
        x: 1420,
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
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getInitialHP(), 1105, 765);
    globals.ctx.fillText(card.getInitialMadness(), 1175, 765);
    globals.ctx.fillText(card.getInitialAttack(), 1240, 765);
    globals.ctx.fillText(card.getInitialDefense(), 1150, 765);
    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 347);
    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  }

  #renderExpandedWeapon(card) {
    this.#renderExpandedCardImageAndTemplate(card);

    // RENDER ICONS
    const icons = card.getImageSet().getIcons().bigVersion;
    const iconsPositions = [
      {
        // DAMAGE
        x: 1000,
        y: 327,
      },
      {
        // DURABILITY
        x: 1060,
        y: 758,
      },
      {
        // PREPARATION TIME
        x: 1135,
        y: 758,
      },
    ];
    for (let i = 0; i < icons.length; i++) {
      const { x, y } = iconsPositions[i];
      globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, 30, 30);
    }

    // RENDER ATTRIBUTES VALUES

    const canvasWidthDividedBy2 = globals.canvas.width / 2;

    globals.ctx.textAlign = "center";
    globals.ctx.textBaseline = "middle";
    globals.ctx.font = "16px MedievalSharp";
    globals.ctx.fillStyle = "black";

    globals.ctx.fillText(card.getInitialHP(), 1110, 765);
    globals.ctx.fillText(card.getInitialAttack(), 600, 700);
    globals.ctx.fillText(card.getInitialDefense(), 600, 700);
    globals.ctx.fillText(card.getName(), canvasWidthDividedBy2 + 12, 347);
    globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  }

  // #renderExpandedWeapon(card) {
  //   // DARKEN THE BACKGROUND TO PUT THE FOCUS ON THE EXPANDED CARD
  //   globals.ctx.globalAlpha = 0.5;
  //   globals.ctx.fillStyle = "black";
  //   globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
  //   globals.ctx.globalAlpha = 1;

  //   const canvasWidthDividedBy2 = globals.canvas.width / 2;
  //   const canvasHeightDividedBy2 = globals.canvas.height / 2;
  //   globals.ctx.textAlign = "center";

  //   const cardAndTemplateWidth =
  //     globals.imagesDestinationSizes.allCardsBigVersion.width;
  //   const cardAndTemplateHeight =
  //     globals.imagesDestinationSizes.allCardsBigVersion.height;

  //   // RENDER THE CARD IMAGE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getCard(),
  //     0,
  //     0,
  //     1024,
  //     1024,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   // RENDER THE CARD TEMPLATE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getBigVersionTemplate(),
  //     0,
  //     0,
  //     625,
  //     801,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   globals.ctx.font = "24px MedievalSharp";
  //   globals.ctx.fillStyle = "white";
  //   globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);
  //   globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  //   // globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 600);
  // }

  // #renderExpandedArmor(card) {
  //   // DARKEN THE BACKGROUND TO PUT THE FOCUS ON THE EXPANDED CARD
  //   globals.ctx.globalAlpha = 0.5;
  //   globals.ctx.fillStyle = "black";
  //   globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
  //   globals.ctx.globalAlpha = 1;

  //   const canvasWidthDividedBy2 = globals.canvas.width / 2;
  //   const canvasHeightDividedBy2 = globals.canvas.height / 2;
  //   globals.ctx.textAlign = "center";

  //   const cardAndTemplateWidth =
  //     globals.imagesDestinationSizes.allCardsBigVersion.width;
  //   const cardAndTemplateHeight =
  //     globals.imagesDestinationSizes.allCardsBigVersion.height;

  //   // RENDER THE CARD IMAGE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getCard(),
  //     0,
  //     0,
  //     1024,
  //     1024,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   // RENDER THE CARD TEMPLATE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getBigVersionTemplate(),
  //     0,
  //     0,
  //     625,
  //     801,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   globals.ctx.font = "24px MedievalSharp";
  //   globals.ctx.fillStyle = "white";
  //   globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);
  //   globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  //   globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 600);
  // }

  // #renderExpandedSpecial(card) {
  //   // DARKEN THE BACKGROUND TO PUT THE FOCUS ON THE EXPANDED CARD
  //   globals.ctx.globalAlpha = 0.5;
  //   globals.ctx.fillStyle = "black";
  //   globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
  //   globals.ctx.globalAlpha = 1;

  //   const canvasWidthDividedBy2 = globals.canvas.width / 2;
  //   const canvasHeightDividedBy2 = globals.canvas.height / 2;
  //   globals.ctx.textAlign = "center";

  //   const cardAndTemplateWidth =
  //     globals.imagesDestinationSizes.allCardsBigVersion.width;
  //   const cardAndTemplateHeight =
  //     globals.imagesDestinationSizes.allCardsBigVersion.height;

  //   // RENDER THE CARD IMAGE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getCard(),
  //     0,
  //     0,
  //     1024,
  //     1024,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   // RENDER THE CARD TEMPLATE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getBigVersionTemplate(),
  //     0,
  //     0,
  //     625,
  //     801,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   globals.ctx.font = "24px MedievalSharp";
  //   globals.ctx.fillStyle = "white";
  //   globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);
  //   globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  //   // globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 600);
  // }

  // #renderExpandedRare(card) {
  //   // DARKEN THE BACKGROUND TO PUT THE FOCUS ON THE EXPANDED CARD
  //   globals.ctx.globalAlpha = 0.5;
  //   globals.ctx.fillStyle = "black";
  //   globals.ctx.fillRect(0, 0, globals.canvas.width, globals.canvas.height);
  //   globals.ctx.globalAlpha = 1;

  //   const canvasWidthDividedBy2 = globals.canvas.width / 2;
  //   const canvasHeightDividedBy2 = globals.canvas.height / 2;
  //   globals.ctx.textAlign = "center";

  //   const cardAndTemplateWidth =
  //     globals.imagesDestinationSizes.allCardsBigVersion.width;
  //   const cardAndTemplateHeight =
  //     globals.imagesDestinationSizes.allCardsBigVersion.height;

  //   // RENDER THE CARD IMAGE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getCard(),
  //     0,
  //     0,
  //     1024,
  //     1024,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   // RENDER THE CARD TEMPLATE
  //   globals.ctx.drawImage(
  //     card.getImageSet().getBigVersionTemplate(),
  //     0,
  //     0,
  //     625,
  //     801,
  //     canvasWidthDividedBy2 - cardAndTemplateWidth / 2,
  //     canvasHeightDividedBy2 - cardAndTemplateHeight / 2,
  //     cardAndTemplateWidth,
  //     cardAndTemplateHeight
  //   );

  //   globals.ctx.font = "24px MedievalSharp";
  //   globals.ctx.fillStyle = "white";
  //   globals.ctx.fillText(card.getName(), canvasWidthDividedBy2, 365);
  //   globals.ctx.fillText(card.getDescription(), canvasWidthDividedBy2, 540);
  //   // globals.ctx.fillText(card.getSpecialSkill(), canvasWidthDividedBy2, 600);
  // }

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
            globals.cardsIconsImages[IconID.EVENT_EFFECT],
            globals.cardsIconsImages[IconID.EVENT_PREP_TIME],
            globals.cardsIconsImages[IconID.EVENT_DURATION],
          ],
        };
        let cardTypeIcon;

        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          cardImage = globals.cardsImages.main_characters[currentCard.getID()];

          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_SMALL];

          bigVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_BIG];

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
              ],
              bigVersion: [
                globals.cardsIconsImages[IconID.MINION_HP],
                globals.cardsIconsImages[IconID.MINION_MADNESS],
                globals.cardsIconsImages[IconID.MINION_ATTACK],
                globals.cardsIconsImages[IconID.MINION_DEFENSE],
              ],
            };

            if (currentCard.getMinionType() === MinionType.SPECIAL) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_SPECIAL_BIG];

              cardTypeIcon =
                globals.cardsIconsImages[IconID.MINION_SPECIAL_TYPE];
            } else if (currentCard.getMinionType() === MinionType.WARRIOR) {
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

            if (currentCard.getWeaponType() === WeaponType.MELEE) {
              cardTypeIcon = globals.cardsIconsImages[IconID.WEAPON_MELEE_TYPE];
            } else if (currentCard.getWeaponType() === WeaponType.MISSILE) {
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
                globals.cardsIconsImages[IconID.EVENT_EFFECT],
                globals.cardsIconsImages[IconID.WEAPON_ARMOR_DURABILITY],
                globals.cardsIconsImages[IconID.EVENT_PREP_TIME],
              ],
            };

            if (currentCard.getArmorType() === ArmorType.LIGHT) {
              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE];
            } else if (currentCard.getArmorType() === ArmorType.MEDIUM) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE];
            } else {
              cardTypeIcon = globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE];
            }
          } else if (currentCard.getCategory() === CardCategory.SPECIAL) {
            cardImage = globals.cardsImages.special[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.SPECIAL_EVENTS_BIG];

            cardTypeIcon = globals.cardsIconsImages[IconID.SPECIAL_TYPE];
          } else {
            cardImage = globals.cardsImages.rare[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.RARE_EVENTS_BIG];

            cardTypeIcon = globals.cardsIconsImages[IconID.RARE_TYPE];
          }
        }

        if (cardTypeIcon) {
          for (const cardVersion in iconsImages) {
            iconsImages[cardVersion].unshift(cardTypeIcon);
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
}
