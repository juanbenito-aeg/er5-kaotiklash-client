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

  constructor(players, currentPlayer, deckContainer, board, turns, mouseInput) {
    this.#players = players;
    this.#currentPlayer = currentPlayer;
    this.#deckContainer = deckContainer;
    this.#board = board;
    this.#turns = turns;
    this.#mouseInput = mouseInput;
  }

  static create() {
    // PLAYERS CREATION
    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2");
    const players = [player1, player2];

    // MAIN DECK CONFIGURATION FILE LOAD
    const url = "./src/mainDeck.json";
    const response = await fetch(url);
    const mainDeckConfig = response.json();

    // DECKS CREATION
    const deckCreator = new DeckCreator(cardsData, mainDeckConfig);
    let deckContainer = deckCreator.createMainDeck();
    deckContainer = deckCreator.createAllDecks(deckContainer.getDecks()[0]);

    // APPLICATION OF THE "CardView" DECORATOR TO ALL THE CARDS
    for (let i = 0; i < deckContainer.getDecks().length; i++) {
      const currentDeck = deckContainer.getDecks()[i];

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        const bigVersionReverse = new Image();
        bigVersionReverse.src = "../../images/version_big_reverse.png";
        const bigVersionReverseImageSet = new ImageSet(
          bigVersionReverse,
          0,
          0,
          0,
          0,
          0,
          0
        );

        const smallVersionReverse = new Image();
        smallVersionReverse.src = "../../images/version_small_reverse.png";
        const smallVersionReverseImageSet = new ImageSet(
          smallVersionReverse,
          0,
          0,
          0,
          0,
          0,
          0
        );

        const bigVersion = new Image();
        const smallVersion = new Image();
        const bigVersionTemplate = new Image();
        const smallVersionTemplate = new Image();
        const icons = [];
        const iconsImageSets = [];

        switch (currentCard.getCategory()) {
          case CardCategory.MAIN_CHARACTER:
            bigVersion.src =
              cardsData.main_characters[
                currentCard.getID()
              ].big_version_img_src;

            smallVersion.src =
              cardsData.main_characters[
                currentCard.getID()
              ].small_version_img_src;

            bigVersionTemplate.src = "¿?"; // NEW COMMON TEMPLATE FOR MCs NEEDED

            smallVersionTemplate.src = "¿?"; // NEW COMMON TEMPLATE FOR MCs NEEDED

            break;

          case CardCategory.MINION:
            bigVersion.src =
              cardsData.minions[currentCard.getID()].big_version_img_src;

            smallVersion.src =
              cardsData.minions[currentCard.getID()].small_version_img_src;

            if (currentCard.getMinionType() === MinionType.SPECIAL) {
              bigVersionTemplate.src =
                "../../images/minions/special/templates/version_big.png";
            } else if (currentCard.getMinionType() === MinionType.WARRIOR) {
              bigVersionTemplate.src =
                "../../images/minions/warriors/templates/version_big.png";
            } else {
              bigVersionTemplate.src =
                "../../images/minions/wizards/templates/version_big.png";
            }

            smallVersionTemplate.src =
              "../../images/common_templates/version_small_minion.png";

            break;

          case CardCategory.ARMOR:
            bigVersion.src =
              cardsData.armor[currentCard.getID()].big_version_img_src;

            smallVersion.src =
              cardsData.armor[currentCard.getID()].small_version_img_src;

            if (
              currentCard.getArmorType() === ArmorType.LIGHT ||
              currentCard.getArmorType() === ArmorType.HEAVY
            ) {
              bigVersionTemplate.src =
                "../../images/armor/templates/types_light_heavy.png";
            } else {
              bigVersionTemplate.src =
                "../../images/armor/templates/type_medium.png";
            }

            smallVersionTemplate.src =
              "../../images/common_templates/version_small_event.png";

            break;

          case CardCategory.WEAPON:
            bigVersion.src =
              cardsData.weapons[currentCard.getID()].big_version_img_src;

            smallVersion.src =
              cardsData.weapons[currentCard.getID()].small_version_img_src;

            bigVersionTemplate.src = "../images/weapons/version_big.png";

            smallVersionTemplate.src =
              "../images/common_templates/version_small_event.png";

            break;

          case CardCategory.SPECIAL:
            bigVersion.src =
              cardsData.special[currentCard.getID()].big_version_img_src;

            smallVersion.src =
              cardsData.special[currentCard.getID()].small_version_img_src;

            bigVersionTemplate.src = "../../images/special/version_big.png";

            smallVersionTemplate.src =
              "../images/common_templates/version_small_event.png.png";

            break;

          case CardCategory.RARE:
            bigVersion.src =
              cardsData.rare[currentCard.getID()].big_version_img_src;

            smallVersion.src =
              cardsData.rare[currentCard.getID()].small_version_img_src;

            bigVersionTemplate.src = "../../images/rare/version_big.png";

            smallVersionTemplate.src =
              "../images/common_templates/version_small_event.png.png";

            break;
        }

        const bigVersionImageSet = new ImageSet(bigVersion, 0, 0, 0, 0, 0, 0);

        const smallVersionImageSet = new ImageSet(
          smallVersion,
          0,
          0,
          0,
          0,
          0,
          0
        );

        const bigVersionTemplateImageSet = new ImageSet(
          bigVersionTemplate,
          0,
          0,
          0,
          0,
          0,
          0
        );

        const smallVersionTemplateImageSet = new ImageSet(
          smallVersionTemplate,
          0,
          0,
          0,
          0,
          0,
          0
        );

        currentCard = new CardView(
          currentCard,
          0,
          0,
          bigVersionReverseImageSet,
          smallVersionReverseImageSet,
          bigVersionImageSet,
          smallVersionImageSet,
          bigVersionTemplateImageSet,
          smallVersionTemplateImageSet,
          iconsImageSets
        );
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
