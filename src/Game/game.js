import Player from "./Player.js";
class Game {
    
    constructor(board, mouseInput){
        this.players = [];
        this.decks = []; 
        this.board = board;
        this.turn = [];
        this.mouseInput = mouseInput;
    }

    create(){

       const player1 = Player.getName("Player 1");
       const player2 = Player.getName("Player 2");

    }
}