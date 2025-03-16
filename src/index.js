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
  cardsData: {},
  cardsReverseImg: {},
  cardsImgs: {
    mainCharacters: [],
    minions: [],
    weapons: [],
    armor: [],
    special: [],
    rare: [],
  },
  cardsTemplatesImgs: [],
  cardsIconsImgs: [],
  assetsToLoad: [], // HOLDS THE ELEMENTS TO LOAD
  assetsLoaded: 0, // INDICATES THE NUMBER OF ELEMENTS THAT HAVE BEEN LOADED SO FAR
  gameState: GameState.INVALID,
  game: {},
  language: 0,
  isFinished: false,
};

async function loadDBCardsDataAndAssets() {
  // RELATIVE PATH TO THE FILE CONTAINING THE CARDS DATA
  const url = "./src/cardsData.json";

  const response = await fetch(url);

  if (response.ok) {
    globals.cardsData = await response.json();

    loadAssets();
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

function executeGameLoop(timeStamp) {
  // KEEP REQUESTING ANIMATION FRAMES
  window.requestAnimationFrame(executeGameLoop, globals.canvas);

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

  // INITIALIZE TIME MANAGEMENT VARIABLES
  globals.previousCycleMilliseconds = 0;
  globals.deltaTime = 0;
  globals.frameTimeObj = 1 / FPS;

  // INITIALIZE CANVAS AND ITS CONTEXT
  globals.canvas = document.getElementById("game-screen");
  globals.canvas.style.display = "block";
  globals.ctx = globals.canvas.getContext("2d");

  // LOAD DB CARDS DATA AND ASSETS
  loadDBCardsDataAndAssets();
}

function loadAssets() {
  // LOAD CARDS REVERSE
  globals.cardsReverseImg = new Image();
  globals.cardsReverseImg.addEventListener("load", loadHandler, false);
  globals.cardsReverseImg.src = "../images/reverse.png";
  globals.assetsToLoad.push(globals.cardsReverseImg);

  // LOAD CARDS IMAGES
  for (const cardCategory in globals.cardsData) {
    if (
      cardCategory === "main_characters" ||
      cardCategory === "minions" ||
      cardCategory === "weapons" ||
      cardCategory === "armor" ||
      cardCategory === "special" ||
      cardCategory === "rare"
    ) {
      for (let i = 0; i < globals.cardsData[cardCategory].length; i++) {
        const currentImage = new Image();
        currentImage.addEventListener("load", loadHandler, false);
        currentImage.src = globals.cardsData[cardCategory][i].image_src;

        switch (cardCategory) {
          case "main_characters":
            globals.cardsImgs.mainCharacters.push(currentImage);
            break;

          case "minions":
            globals.cardsImgs.minions.push(currentImage);
            break;

          case "weapons":
            globals.cardsImgs.weapons.push(currentImage);
            break;

          case "armor":
            globals.cardsImgs.armor.push(currentImage);
            break;

          case "special":
            globals.cardsImgs.special.push(currentImage);
            break;

          case "rare":
            globals.cardsImgs.rare.push(currentImage);
            break;
        }

        globals.assetsToLoad.push(currentImage);
      }
    }
  }

  // LOAD CARDS TEMPLATES

  const templates = {
    mainCharactersSmall:
      "../images/main_characters/templates/version_small.png",
    minionsAndEventsSmall:
      "../images/common_templates/version_small_minion_event.png",
  };

  for (const template in templates) {
    const templateToLoad = new Image();
    templateToLoad.addEventListener("load", loadHandler, false);
    templateToLoad.src = templates[template];
    globals.cardsTemplatesImgs.push(templateToLoad);
    globals.assetsToLoad.push(templateToLoad);
  }

  // LOAD CARDS ICONS

  const icons = {
    attackDmgDiamond: "../images/common_icons/attack_dmg_diamond.png",
    defenseDurabilityDiamond:
      "../images/common_icons/defense_durability_diamond.png",
    minionsSpecialType: "../images/minions/special/icons/type.png",
    minionsWarriorType: "../images/minions/warriors/icons/type.png",
    minionsWizardType: "../images/minions/wizards/icons/type.png",
    minionsHPDiamond: "../images/common_icons/minion_hp_diamond.png",
    eventsTypeCircle: "../images/common_icons/event_type_circle.png",
    eventsPrepTimeDiamond: "../images/common_icons/event_prep_time_diamond.png",
    eventsDurationDiamond: "../images/common_icons/event_duration_diamond.png",
    eventsEffectDiamond: "../images/common_icons/event_effect_diamond.png",
    weaponsMeleeType: "../images/weapons/icons/type_melee.png",
    weaponsMissileType: "../images/weapons/icons/type_missile.png",
    weaponsHybridType: "../images/weapons/icons/type_hybrid.png",
    armorLightType: "../images/armor/icons/type_light.png",
    armorMediumType: "../images/armor/icons/type_medium.png",
    armorHeavyType: "../images/armor/icons/type_heavy.png",
    specialType: "../images/special/icons/type.png",
    rareType: "../images/rare/icons/type.png",
  };

  for (const icon in icons) {
    const iconToLoad = new Image();
    iconToLoad.addEventListener("load", loadHandler, false);
    iconToLoad.src = icons[icon];
    globals.cardsIconsImgs.push(iconToLoad);
    globals.assetsToLoad.push(iconToLoad);
  }
}

// CODE BLOCK TO CALL EACH TIME AN ASSET IS LOADED
async function loadHandler() {
  globals.assetsLoaded++;

  if (globals.assetsLoaded === globals.assetsToLoad.length) {
    globals.gameState = GameState.FAKE_CARDS_DISPLAY;

    globals.game = await Game.create();

    // FIRST FRAME REQUEST
    window.requestAnimationFrame(executeGameLoop);
  }
}

window.onload = initStartGameScreen;

function initStartGameScreen() {
  const btn = document.getElementById("start-game-btn");
  btn.addEventListener("click", initGameScreen);
}

export { globals };
