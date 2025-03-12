import Game from "./Game/Game.js";

// INITIALIZATION OF GLOBAL VARIABLES
const globals = {
    game: {},
};

function initGame() {
    const startGameScreen = document.getElementById("start-game-screen");
    startGameScreen.style.display = "none";
    
    const gameScreen = document.getElementById("game-screen");
    gameScreen.style.display = "block";
    
    globals.game = Game.create();
}

window.onload = initEssentials;

function initEssentials() {
    const btn = document.getElementById("start-game-btn");
    btn.addEventListener("click", initGame);
}

export {
    globals,
};