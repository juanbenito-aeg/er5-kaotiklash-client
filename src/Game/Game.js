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

    // GRIDS (BOARD) CREATION
    const gridCreator = new GridCreator();
    game.#board = gridCreator.createAllGrids();
    game.#board.setImage(globals.boardImage);

    // TURNS CREATION
    const turnPlayer1 = new Turn(0, game.#deckContainer, game.#board, null, game.#currentPlayer);
    const turnPlayer2 = new Turn(0, game.#deckContainer, game.#board, null, game.#currentPlayer);
    game.#turns = [turnPlayer1, turnPlayer2];
  
    game.#turns[game.#currentPlayer].create();
    
    // MOUSEINPUT CREATION
    game.#mouseInput = new MouseInput();
    game.#mouseInput.mouseEventListener();

    return game;
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {

  }

  #render() {
    this.#renderBoard();

    switch (globals.gameState) {
      case GameState.GRIDS_DRAWING:
        this.#renderGrids();
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
        let iconsImages = [
          globals.cardsIconsImages[IconID.EVENT_EFFECT_DIAMOND],
          globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
          globals.cardsIconsImages[IconID.EVENT_DURATION_DIAMOND],
        ];

        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          cardImage = globals.cardsImages.main_characters[currentCard.getID()];

          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_SMALL];

          bigVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_BIG];

          iconsImages = [];
        } else {
          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MINIONS_AND_EVENTS_SMALL];

          if (currentCard.getCategory() === CardCategory.MINION) {
            cardImage = globals.cardsImages.minions[currentCard.getID()];

            iconsImages = [
              globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImages[IconID.MINION_HP_DIAMOND],
              globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
            ];

            if (currentCard.getMinionType() === MinionType.SPECIAL) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_SPECIAL_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_SPECIAL_TYPE]
              );
            } else if (currentCard.getMinionType() === MinionType.WARRIOR) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WARRIORS_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_WARRIOR_TYPE]
              );
            } else {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WIZARDS_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_WIZARD_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.WEAPON) {
            cardImage = globals.cardsImages.weapons[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.WEAPONS_BIG];

            iconsImages = [
              globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
              globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
            ];

            if (currentCard.getWeaponType() === WeaponType.MELEE) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_MELEE_TYPE]
              );
            } else if (currentCard.getWeaponType() === WeaponType.MISSILE) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_MISSILE_TYPE]
              );
            } else {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_HYBRID_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.ARMOR) {
            cardImage = globals.cardsImages.armor[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

            if (currentCard.getArmorType() === ArmorType.LIGHT) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE]
              );
            } else if (currentCard.getArmorType() === ArmorType.MEDIUM) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE]
              );
            } else {
              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.SPECIAL) {
            cardImage = globals.cardsImages.special[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.SPECIAL_EVENTS_BIG];
          } else {
            cardImage = globals.cardsImages.rare[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.RARE_EVENTS_BIG];
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
