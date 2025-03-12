import Game from "./Game/Game.js";

window.onload = init;

function showImage() {
    
    const startGameScreen = document.getElementById("start-game-screen");
    const gameScreen = document.getElementById("game-screen");
   
    startGameScreen.style.display = "none";
    gameScreen.style.display = "block";

}

function init() {
  
    const btn = document.getElementById("start-game-btn");

    btn.addEventListener("click", showImage); 

}
