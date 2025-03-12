import Player from "./Player.js";

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
        const player1 = new Player("Player 1");
        const player2 = new Player("Player 2");
        players = [player1, player2];

        const game = new Game();
    }
}
