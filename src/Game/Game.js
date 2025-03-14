import Player from "./Player.js";
import DeckCreator from "../Decks/DeckCreator.js";
import cardsData from "../cardsData.json";
import mainDeckConfig from "../mainDeck.json";
import Board from "../Board/Board.js";
import Turn from "../Turns/Turn.js";
import MouseInput from "./MouseInput.js";
import CardView from "../Decks/CardView.js";
import ImageSet from "./ImageSet.js";

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

    // DECKS CREATION
    cardsData = JSON.parse(cardsData);
    mainDeckConfig = JSON.parse(mainDeckConfig);
    const deckCreator = new DeckCreator(cardsData, mainDeckConfig);
    let deckContainer = deckCreator.createMainDeck();
    deckContainer = deckCreator.createAllDecks(deckContainer.getDecks()[0]);

    // CREATE "CardView" OBJECTS
    const cardView = [];
    const cards = deckContainer.getDecks()[0];

    for(let i = 0; i < cards.length; i++){
      const x = i * 0;
      const y = 0;
      const imageSet = new ImageSet();
      cardViewCreate = new CardView(x, y, imageSet);
      cardView.push(cardViewCreate);
    }

    // BOARD CREATION
    const board = new Board();
    board.create();

    // TURNS CREATION
    const turnPlayer1 = new Turn();
    const turnPlayer2 = new Turn();

    // MOUSE CREATION
    const mouseInput = new MouseInput();
    mouseInput.mouseEventListener();

    const game = new Game(players);
    return game;
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {}

  #render() {}
}
