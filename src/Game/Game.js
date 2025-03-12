import Player from "./Player.js";
import DeckCreator from "../Decks/DeckCreator.js";
// import cardsData from "../cardsData.json";
import mainDeckConfig from "../mainDeck.json";

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
    // cardsData = JSON.parse(cardsData);
    mainDeckConfig = JSON.parse(mainDeckConfig);
    const deckCreator = new DeckCreator();
    const deckContainer = deckCreator.createMainDeck();

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
