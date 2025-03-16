import Player from "./Player.js";
import CardView from "../Decks/CardView.js";
import Deck from "../Decks/Deck.js";
import DeckCreator from "../Decks/DeckCreator.js";
import Board from "../Board/Board.js";
import Turn from "../Turns/Turn.js";
import MouseInput from "./MouseInput.js";
import { GameState, CardCategory, WeaponType, ArmorType } from "./constants.js";
import { globals } from "../index.js";

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
    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2");
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

    // BOARD CREATION
    game.#board = new Board();
    game.#board.create();

    // TURNS CREATION
    const turnPlayer1 = new Turn();
    const turnPlayer2 = new Turn();
    game.#turns = [turnPlayer1, turnPlayer2];

    // MOUSEINPUT CREATION
    game.#mouseInput = new MouseInput();
    game.#mouseInput.mouseEventListener();

    return game;
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {}

  #render() {
    this.#renderBoard();

    switch (globals.gameState) {
      case GameState.FAKE_CARDS_DISPLAY:
        this.#renderSmallVersionCards();
        break;
    }
  }

  #renderBoard() {
    globals.ctx.drawImage(
      this.#board.getImage(),
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

  #renderSmallVersionCards() {
    let xCoordinate = 180;
    let yCoordinate = 165;
    let numOfCardsRenderedInSameRow = 0;
    let numOfRenderedRows = 0;

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        const currentCard = currentDeck.getCards()[j];

        this.#renderSmallVersionCard(currentCard, xCoordinate, yCoordinate);

        numOfCardsRenderedInSameRow++;

        if (numOfCardsRenderedInSameRow === 15) {
          numOfRenderedRows++;

          if (numOfRenderedRows === 6) {
            return;
          }

          numOfCardsRenderedInSameRow = 0;

          xCoordinate = 180;
          yCoordinate += 135;
        } else {
          xCoordinate += 135;
        }
      }
    }
  }

  #renderSmallVersionCard(card, xCoordinate, yCoordinate) {
    const renderData = [];

    // CARD IMAGE
    renderData.push({
      image: {},
      sx: 0,
      sy: 0,
      sWidth: 1024,
      sHeight: 1024,
      dx: xCoordinate,
      dy: yCoordinate,
      dWidth: 110,
      dHeight: 110,
    });

    // TEMPLATE IMAGE
    renderData.push({
      image: globals.cardsTemplatesImgs[1],
      sx: 0,
      sy: 0,
      sWidth: 633,
      sHeight: 823,
      dx: xCoordinate,
      dy: yCoordinate,
      dWidth: 110,
      dHeight: 110,
    });

    switch (card.getCategory()) {
      case CardCategory.MAIN_CHARACTER:
        renderData[0].image = globals.cardsImgs.mainCharacters[card.getID()];

        renderData[1].image = globals.cardsTemplatesImgs[0];
        renderData[1].sWidth = 575;
        renderData[1].sHeight = 809;

        break;

      case CardCategory.MINION:
        renderData[0].image = globals.cardsImgs.minions[card.getID()];

        // TYPE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[card.getMinionType()],
          sx: 0,
          sy: 0,
          sWidth: 1024,
          sHeight: 1024,
          dx: xCoordinate + 38,
          dy: yCoordinate - 12,
          dWidth: 35,
          dHeight: 35,
        });

        // ATTACK IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[4],
          text: globals.cardsData.minions[card.getID()].attack + "",
          sx: 0,
          sy: 0,
          sWidth: 177,
          sHeight: 187,
          dx: xCoordinate - 13,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        // HP IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[3],
          text: globals.cardsData.minions[card.getID()].hp + "",
          sx: 0,
          sy: 0,
          sWidth: 202,
          sHeight: 204,
          dx: xCoordinate + 37,
          dy: yCoordinate + 87,
          dWidth: 35,
          dHeight: 35,
        });

        // DEFENSE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[5],
          text: globals.cardsData.minions[card.getID()].defense + "",
          sx: 0,
          sy: 0,
          sWidth: 189,
          sHeight: 201,
          dx: xCoordinate + 87,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        break;

      case CardCategory.WEAPON:
        renderData[0].image = globals.cardsImgs.weapons[card.getID()];

        // TYPE CIRCLE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[6],
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 147,
          dx: xCoordinate + 38,
          dy: yCoordinate - 12,
          dWidth: 35,
          dHeight: 35,
        });

        let weaponTypeImage;
        let weaponTypeSWidth;
        let weaponTypeSHeight;

        if (card.getWeaponType() === WeaponType.MELEE) {
          // MELEE TYPE IMAGE DATA
          weaponTypeImage = globals.cardsIconsImgs[10];
          weaponTypeSWidth = 512;
          weaponTypeSHeight = 512;
        } else if (card.getWeaponType() === WeaponType.MISSILE) {
          // MISSILE TYPE IMAGE DATA
          weaponTypeImage = globals.cardsIconsImgs[0 /* TO BE UPDATED */];
          weaponTypeSWidth = 0; /* TO BE UPDATED */
          weaponTypeSHeight = 0; /* TO BE UPDATED */
        } else {
          // HYBRID TYPE IMAGE DATA
          weaponTypeImage = globals.cardsIconsImgs[0 /* TO BE UPDATED */];
          weaponTypeSWidth = 0; /* TO BE UPDATED */
          weaponTypeSHeight = 0; /* TO BE UPDATED */
        }

        // TYPE IMAGE
        renderData.push({
          image: weaponTypeImage,
          sx: 0,
          sy: 0,
          sWidth: weaponTypeSWidth,
          sHeight: weaponTypeSHeight,
          dx: xCoordinate + 45,
          dy: yCoordinate - 5,
          dWidth: 20,
          dHeight: 20,
        });

        // DAMAGE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[4],
          text: globals.cardsData.weapons[card.getID()].damage + "",
          sx: 0,
          sy: 0,
          sWidth: 177,
          sHeight: 187,
          dx: xCoordinate - 13,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        // PREPARATION TIME IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[7],
          text:
            globals.cardsData.weapons[card.getID()].prep_time_in_rounds + "",
          sx: 0,
          sy: 0,
          sWidth: 181,
          sHeight: 184,
          dx: xCoordinate + 37,
          dy: yCoordinate + 87,
          dWidth: 35,
          dHeight: 35,
        });

        // DURABILITY IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[5],
          text: globals.cardsData.weapons[card.getID()].durability + "",
          sx: 0,
          sy: 0,
          sWidth: 189,
          sHeight: 201,
          dx: xCoordinate + 87,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        break;

      case CardCategory.ARMOR:
        renderData[0].image = globals.cardsImgs.armor[card.getID()];

        // TYPE CIRCLE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[6],
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 147,
          dx: xCoordinate + 38,
          dy: yCoordinate - 12,
          dWidth: 35,
          dHeight: 35,
        });

        let armorTypeImage;
        let armorTypeSWidth;
        let armorTypeSHeight;

        if (card.getArmorType() === ArmorType.LIGHT) {
          // LIGHT TYPE IMAGE DATA
          armorTypeImage = globals.cardsIconsImgs[0 /* TO BE UPDATED */];
          armorTypeSWidth = 0; /* TO BE UPDATED */
          armorTypeSHeight = 0; /* TO BE UPDATED */
        } else if (card.getArmorType() === ArmorType.MEDIUM) {
          // MEDIUM TYPE IMAGE DATA
          armorTypeImage = globals.cardsIconsImgs[0 /* TO BE UPDATED */];
          armorTypeSWidth = 0; /* TO BE UPDATED */
          armorTypeSHeight = 0; /* TO BE UPDATED */
        } else {
          // HEAVY TYPE IMAGE DATA
          armorTypeImage = globals.cardsIconsImgs[11];
          armorTypeSWidth = 200;
          armorTypeSHeight = 200;
        }

        // TYPE IMAGE
        renderData.push({
          image: armorTypeImage,
          sx: 0,
          sy: 0,
          sWidth: armorTypeSWidth,
          sHeight: armorTypeSHeight,
          dx: xCoordinate + 45,
          dy: yCoordinate - 5,
          dWidth: 20,
          dHeight: 20,
        });

        // (SPECIAL) EFFECT IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[9],
          text: "SE",
          sx: 0,
          sy: 0,
          sWidth: 194,
          sHeight: 199,
          dx: xCoordinate - 13,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        // PREPARATION TIME IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[7],
          text: globals.cardsData.armor[card.getID()].prep_time_in_rounds + "",
          sx: 0,
          sy: 0,
          sWidth: 181,
          sHeight: 184,
          dx: xCoordinate + 37,
          dy: yCoordinate + 87,
          dWidth: 35,
          dHeight: 35,
        });

        // DURABILITY IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[5],
          text: globals.cardsData.armor[card.getID()].durability + "",
          sx: 0,
          sy: 0,
          sWidth: 189,
          sHeight: 201,
          dx: xCoordinate + 87,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        break;

      case CardCategory.SPECIAL:
        renderData[0].image = globals.cardsImgs.special[card.getID()];

        // TYPE CIRCLE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[6],
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 147,
          dx: xCoordinate + 38,
          dy: yCoordinate - 12,
          dWidth: 35,
          dHeight: 35,
        });

        // TYPE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[12],
          sx: 0,
          sy: 0,
          sWidth: 1080,
          sHeight: 1080,
          dx: xCoordinate + 38,
          dy: yCoordinate - 13,
          dWidth: 35,
          dHeight: 35,
        });

        // EFFECT IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[9],
          text: "EF",
          sx: 0,
          sy: 0,
          sWidth: 194,
          sHeight: 199,
          dx: xCoordinate - 13,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        // PREPARATION TIME IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[7],
          text:
            globals.cardsData.special[card.getID()].prep_time_in_rounds + "",
          sx: 0,
          sy: 0,
          sWidth: 181,
          sHeight: 184,
          dx: xCoordinate + 37,
          dy: yCoordinate + 87,
          dWidth: 35,
          dHeight: 35,
        });

        // DURATION IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[8],
          text: globals.cardsData.special[card.getID()].duration_in_rounds + "",
          sx: 0,
          sy: 0,
          sWidth: 176,
          sHeight: 186,
          dx: xCoordinate + 87,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        break;

      case CardCategory.RARE:
        renderData[0].image = globals.cardsImgs.rare[card.getID()];

        // TYPE CIRCLE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[6],
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 147,
          dx: xCoordinate + 38,
          dy: yCoordinate - 12,
          dWidth: 35,
          dHeight: 35,
        });

        // TYPE IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[13],
          sx: 0,
          sy: 0,
          sWidth: 611,
          sHeight: 613,
          dx: xCoordinate + 43,
          dy: yCoordinate - 7,
          dWidth: 25,
          dHeight: 25,
        });

        // EFFECT IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[9],
          text: "EF",
          sx: 0,
          sy: 0,
          sWidth: 194,
          sHeight: 199,
          dx: xCoordinate - 13,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        // PREPARATION TIME IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[7],
          text: "0",
          sx: 0,
          sy: 0,
          sWidth: 181,
          sHeight: 184,
          dx: xCoordinate + 37,
          dy: yCoordinate + 87,
          dWidth: 35,
          dHeight: 35,
        });

        // DURATION IMAGE
        renderData.push({
          image: globals.cardsIconsImgs[8],
          text: globals.cardsData.rare[card.getID()].duration_in_rounds + "",
          sx: 0,
          sy: 0,
          sWidth: 176,
          sHeight: 186,
          dx: xCoordinate + 87,
          dy: yCoordinate + 40,
          dWidth: 35,
          dHeight: 35,
        });

        break;
    }

    for (let i = 0; i < renderData.length; i++) {
      globals.ctx.drawImage(
        renderData[i].image,
        renderData[i].sx,
        renderData[i].sy,
        renderData[i].sWidth,
        renderData[i].sHeight,
        renderData[i].dx,
        renderData[i].dy,
        renderData[i].dWidth,
        renderData[i].dHeight
      );

      if (renderData[i].text) {
        let dxPlus = 9;
        if (renderData[i].text.length === 1) {
          dxPlus = 14;
        }

        globals.ctx.font = "14px MedievalSharp";
        globals.ctx.fillText(
          renderData[i].text,
          renderData[i].dx + dxPlus,
          renderData[i].dy + 23
        );
      }
    }
  }

  #applyCardViewToAllCards() {
    const updatedDecks = [];

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const updatedDeck = new Deck(i + 1, []);
      updatedDecks.push(updatedDeck);

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        currentCard = new CardView(currentCard, 0, 0);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }
}
