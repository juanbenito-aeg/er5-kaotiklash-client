import Game from "./Game/Game.js";
import { GameState, FPS } from "./Game/constants.js";

// GLOBAL VARIABLES CREATION
const globals = {
  previousCycleMilliseconds: -1, // PREVIOUS CYCLE TIME (MILLISECONDS)
  deltaTime: 0, // ACTUAL GAME CYCLE TIME (SECONDS)
  frameTimeObj: 0, // GOAL CYCLE TIME (SECONDS, CONSTANT)
  cycleRealTime: 0,
  canvas: {},
  ctx: {},
  gameState: GameState.INVALID,
  game: {},
  language: 0,
  isFinished: false,
};

async function loadDBCardsData() {
  // RELATIVE PATH TO THE FILE CONTAINING THE CARDS DATA
  const url = "./src/cardsData.json";

  const response = await fetch(url);

  if (response.ok) {
    const responseJSON = await response.json();
    return responseJSON;
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

function executeGameLoop(timeStamp) {
  // KEEP REQUESTING ANIMATION FRAMES
  window.requestAnimationFrame(gameLoop, globals.canvas);

  // ACTUAL EXECUTION CYCLE TIME
  const elapsedCycleSeconds =
    (timeStamp - globals.previousCycleMilliseconds) / 1000;

  // PREVIOUS EXECUTION CYCLE TIME
  globals.previousCycleMilliseconds = timeStamp;

  // VARIABLE CORRECTING THE FRAME TIME DUE TO DELAYS WITH RESPECT TO GOAL TIME (frameTimeObj)
  globals.deltaTime += elapsedCycleSeconds;

  globals.cycleRealTime += elapsedCycleSeconds;

  if (globals.cycleRealTime >= globals.frameTimeObj) {
    globals.game.execute();

    // CORRECT EXCESS OF TIME
    globals.cycleRealTime -= globals.frameTimeObj;
    globals.deltaTime = 0;
  }
}

async function initGameScreen() {
  const startGameScreen = document.getElementById("start-game-screen");
  startGameScreen.style.display = "none";

  globals.gameState = GameState.FAKE_CARDS_DISPLAY;

  // INITIALIZE TIME MANAGEMENT VARIABLES
  globals.previousCycleMilliseconds = 0;
  globals.deltaTime = 0;
  globals.frameTimeObj = 1 / FPS;

  // INITIALIZE CANVAS AND ITS CONTEXT
  globals.canvas = document.getElementById("game-screen");
  globals.canvas.style.display = "block";
  globals.ctx = globals.canvas.getContext("2d");

  // LOAD DB CARDS DATA
  const cardsData = loadDBCardsData();

  globals.game = await Game.create(cardsData);

  // FIRST FRAME REQUEST
  window.requestAnimationFrame(executeGameLoop);
}

window.onload = initStartGameScreen;

function initStartGameScreen() {
  const btn = document.getElementById("start-game-btn");
  btn.addEventListener("click", initGameScreen);
}

export { globals };
