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
    game.#board.setImageInfo(globals.boardImgInfo);

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
      case GameState.FAKE_CARDS_DISPLAY:
        this.#renderSmallVersionCards();
        break;

      case GameState.GRIDS_DRAWING:
        this.#renderGrids();
        break;
    }
  }

  #renderBoard() {
    globals.ctx.drawImage(
      this.#board.getImageInfo().getImageObj(),
      this.#board.getImageInfo().getSourceX(),
      this.#board.getImageInfo().getSourceY(),
      this.#board.getImageInfo().getSourceWidth(),
      this.#board.getImageInfo().getSourceHeight(),
      this.#board.getImageInfo().getDestinationX(),
      this.#board.getImageInfo().getDestinationY(),
      this.#board.getImageInfo().getSmallVerDestinationWidth(),
      this.#board.getImageInfo().getSmallVerDestinationHeight()
    );
  }

  #renderSmallVersionCards() {
    this.#renderSmallVersionCard(
      this.#deckContainer.getDecks()[0].getCards()[1]
    );
  }

  #renderSmallVersionCard(card) {
    globals.ctx.drawImage(
      card.getImageSet().getCard().getImageObj(),
      card.getImageSet().getCard().getSourceX(),
      card.getImageSet().getCard().getSourceY(),
      card.getImageSet().getCard().getSourceWidth(),
      card.getImageSet().getCard().getSourceHeight(),
      card.getImageSet().getCard().getDestinationX(),
      card.getImageSet().getCard().getDestinationY(),
      card.getImageSet().getCard().getSmallVerDestinationWidth(),
      card.getImageSet().getCard().getSmallVerDestinationHeight()
    );

    for (let i = 0; i < card.getImageSet().getIcons().length; i++) {
      const currentIcon = card.getImageSet().getIcons()[i];

      globals.ctx.drawImage(
        currentIcon.getImageObj(),
        currentIcon.getSourceX(),
        currentIcon.getSourceY(),
        currentIcon.getSourceWidth(),
        currentIcon.getSourceHeight(),
        currentIcon.getDestinationX() +
          card.getImageSet().getCard().getDestinationX(),
        currentIcon.getDestinationY() +
          card.getImageSet().getCard().getDestinationY(),
        currentIcon.getSmallVerDestinationWidth(),
        currentIcon.getSmallVerDestinationHeight()
      );
    }
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

        let cardImageInfo;

        let smallVersionTemplateImageInfo;

        let bigVersionTemplateImageInfo;

        let iconsImagesInfo = [
          globals.cardsIconsImgsInfo[IconID.EVENT_EFFECT_DIAMOND],
          globals.cardsIconsImgsInfo[IconID.EVENT_PREP_TIME_DIAMOND],
          globals.cardsIconsImgsInfo[IconID.EVENT_DURATION_DIAMOND],
        ];

        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          cardImageInfo =
            globals.cardsImgsInfo.mainCharacters[currentCard.getID()];

          smallVersionTemplateImageInfo =
            globals.cardsTemplatesImgsInfo[TemplateID.MAIN_CHARACTERS_SMALL];

          bigVersionTemplateImageInfo =
            globals.cardsTemplatesImgsInfo[TemplateID.MAIN_CHARACTERS_BIG];

          iconsImagesInfo = [];
        } else {
          smallVersionTemplateImageInfo =
            globals.cardsTemplatesImgsInfo[TemplateID.MINIONS_AND_EVENTS_SMALL];

          if (currentCard.getCategory() === CardCategory.MINION) {
            cardImageInfo = globals.cardsImgsInfo.minions[currentCard.getID()];

            iconsImagesInfo = [
              globals.cardsIconsImgsInfo[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImgsInfo[IconID.MINION_HP_DIAMOND],
              globals.cardsIconsImgsInfo[IconID.DEFENSE_DURABILITY_DIAMOND],
            ];

            if (currentCard.getMinionType() === MinionType.SPECIAL) {
              bigVersionTemplateImageInfo =
                globals.cardsTemplatesImgsInfo[TemplateID.MINIONS_SPECIAL_BIG];

              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.MINION_SPECIAL_TYPE]
              );
            } else if (currentCard.getMinionType() === MinionType.WARRIOR) {
              bigVersionTemplateImageInfo =
                globals.cardsTemplatesImgsInfo[TemplateID.MINIONS_WARRIORS_BIG];

              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.MINION_WARRIOR_TYPE]
              );
            } else {
              bigVersionTemplateImageInfo =
                globals.cardsTemplatesImgsInfo[TemplateID.MINIONS_WIZARDS_BIG];

              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.MINION_WIZARD_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.WEAPON) {
            cardImageInfo = globals.cardsImgsInfo.weapons[currentCard.getID()];

            bigVersionTemplateImageInfo =
              globals.cardsTemplatesImgsInfo[TemplateID.WEAPONS_BIG];

            iconsImagesInfo = [
              globals.cardsIconsImgsInfo[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImgsInfo[IconID.EVENT_PREP_TIME_DIAMOND],
              globals.cardsIconsImgsInfo[IconID.DEFENSE_DURABILITY_DIAMOND],
            ];

            if (currentCard.getWeaponType() === WeaponType.MELEE) {
              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.WEAPON_MELEE_TYPE]
              );
            } else if (currentCard.getWeaponType() === WeaponType.MISSILE) {
              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.WEAPON_MISSILE_TYPE]
              );
            } else {
              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.WEAPON_HYBRID_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.ARMOR) {
            cardImageInfo = globals.cardsImgsInfo.armor[currentCard.getID()];

            bigVersionTemplateImageInfo =
              globals.cardsTemplatesImgsInfo[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

            if (currentCard.getArmorType() === ArmorType.LIGHT) {
              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.ARMOR_LIGHT_TYPE]
              );
            } else if (currentCard.getArmorType() === ArmorType.MEDIUM) {
              bigVersionTemplateImageInfo =
                globals.cardsTemplatesImgsInfo[
                  TemplateID.ARMOR_LIGHT_HEAVY_BIG
                ];

              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.ARMOR_MEDIUM_TYPE]
              );
            } else {
              iconsImagesInfo.push(
                globals.cardsIconsImgsInfo[IconID.ARMOR_HEAVY_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.SPECIAL) {
            cardImageInfo = globals.cardsImgsInfo.special[currentCard.getID()];

            bigVersionTemplateImageInfo =
              globals.cardsTemplatesImgsInfo[TemplateID.SPECIAL_EVENTS_BIG];
          } else {
            cardImageInfo = globals.cardsImgsInfo.rare[currentCard.getID()];

            bigVersionTemplateImageInfo =
              globals.cardsTemplatesImgsInfo[TemplateID.RARE_EVENTS_BIG];
          }
        }

        const imageSet = new ImageSet(
          globals.cardsReverseImgInfo,
          cardImageInfo,
          smallVersionTemplateImageInfo,
          bigVersionTemplateImageInfo,
          iconsImagesInfo
        );

        currentCard = new CardView(currentCard, imageSet);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }
}
