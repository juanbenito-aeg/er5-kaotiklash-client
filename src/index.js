import Game from "./Game/Game.js";

// GLOBAL VARIABLES INITIALIZATION
const globals = {
  canvas: {},
  ctx: {},
  game: {},
};

function initGameScreen() {
  const startGameScreen = document.getElementById("start-game-screen");
  startGameScreen.style.display = "none";

  globals.canvas = document.getElementById("game-screen");
  globals.canvas.style.display = "block";

  globals.ctx = globals.canvas.getContext("2d");

  globals.game = Game.create();
}

window.onload = initStartGameScreen;

function initStartGameScreen() {
  const btn = document.getElementById("start-game-btn");
  btn.addEventListener("click", initGameScreen);
}

export { globals };
