import Game from "./Game/Game.js";
import ImageInfo from "./Game/ImageInfo.js";
import { GameState, FPS } from "./Game/constants.js";

// GLOBAL VARIABLES CREATION
const globals = {
  previousCycleMilliseconds: -1, // PREVIOUS CYCLE TIME (MILLISECONDS)
  deltaTime: 0, // ACTUAL GAME CYCLE TIME (SECONDS)
  frameTimeObj: 0, // GOAL CYCLE TIME (SECONDS, CONSTANT)
  cycleRealTime: 0,
  canvas: {},
  ctx: {},
  boardImgInfo: {},
  cardsData: {},
  cardsReverseImgInfo: {},
  cardsImgsInfo: {
    mainCharacters: [],
    minions: [],
    weapons: [],
    armor: [],
    special: [],
    rare: [],
  },
  cardsTemplatesImgsInfo: [],
  cardsIconsImgsInfo: [],
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
  // LOAD BOARD IMAGE

  const boardImage = new Image();
  boardImage.addEventListener("load", loadHandler, false);
  boardImage.src = "../images/board.jpg";
  globals.assetsToLoad.push(boardImage);

  globals.boardImgInfo = new ImageInfo(
    boardImage,
    0,
    0,
    3584,
    2048,
    0,
    0,
    globals.canvas.width,
    globals.canvas.height,
    globals.canvas.width,
    globals.canvas.height
  );

  // LOAD CARDS REVERSE

  const cardsReverseImage = new Image();
  cardsReverseImage.addEventListener("load", loadHandler, false);
  cardsReverseImage.src = "../images/reverse.png";
  globals.assetsToLoad.push(cardsReverseImage);

  globals.cardsReverseImgInfo = new ImageInfo(
    cardsReverseImage,
    0,
    0,
    425,
    587,
    0,
    0,
    110,
    110,
    310,
    510
  );

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
        const currentCardImage = new Image();
        currentCardImage.addEventListener("load", loadHandler, false);
        currentCardImage.src = globals.cardsData[cardCategory][i].image_src;
        globals.assetsToLoad.push(currentCardImage);

        const currentCardImageInfo = new ImageInfo(
          currentCardImage,
          0,
          0,
          1024,
          1024,
          500,
          500,
          110,
          110,
          310,
          510
        );

        switch (cardCategory) {
          case "main_characters":
            globals.cardsImgsInfo.mainCharacters.push(currentCardImageInfo);
            break;

          case "minions":
            globals.cardsImgsInfo.minions.push(currentCardImageInfo);
            break;

          case "weapons":
            globals.cardsImgsInfo.weapons.push(currentCardImageInfo);
            break;

          case "armor":
            globals.cardsImgsInfo.armor.push(currentCardImageInfo);
            break;

          case "special":
            globals.cardsImgsInfo.special.push(currentCardImageInfo);
            break;

          case "rare":
            globals.cardsImgsInfo.rare.push(currentCardImageInfo);
            break;
        }
      }
    }
  }

  // LOAD CARDS TEMPLATES

  const templates = [
    {
      name: "mainCharactersSmall",
      src: "../images/main_characters/templates/version_small.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 575,
      sourceHeight: 809,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "minion&EventSmall",
      src: "../images/common_templates/version_small_minion_event.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 633,
      sourceHeight: 823,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "rareEventBig",
      src: "../images/rare/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 593,
      sourceHeight: 861,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "specialEventBig",
      src: "../images/special/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 593,
      sourceHeight: 861,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "minionWarriorBig",
      src: "../images/minions/warriors/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 657,
      sourceHeight: 920,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "minionWizardBig",
      src: "../images/minions/wizards/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 657,
      sourceHeight: 920,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "minionSpecialBig",
      src: "../images/minions/special/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 657,
      sourceHeight: 920,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "JosephBig",
      src: "../images/main_characters/templates/version_big_joseph.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 554,
      sourceHeight: 775,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "mainCharacterBig",
      src: "../images/main_characters/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 595,
      sourceHeight: 817,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "armorMediumBig",
      src: "../images/armor/templates/type_medium.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 665,
      sourceHeight: 925,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "armorHeavy&LightBig",
      src: "../images/armor/templates/types_light_heavy.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 665,
      sourceHeight: 925,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
    {
      name: "weaponBig",
      src: "../images/weapons/templates/version_big.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 665,
      sourceHeight: 925,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 310,
      bigVerDestinationHeight: 510,
    },
  ];

  createAndStoreImageInfoObjs(templates, globals.cardsTemplatesImgsInfo);

  // LOAD CARDS ICONS

  const icons = [
    {
      name: "attackDamageDiamond",
      src: "../images/common_icons/attack_dmg_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 177,
      sourceHeight: 187,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "defenseDurabilityDiamond",
      src: "../images/common_icons/defense_durability_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 189,
      sourceHeight: 201,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "minionsSpecialType",
      src: "../images/minions/special/icons/type.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 1080,
      sourceHeight: 1080,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "minionsWarriorType",
      src: "../images/minions/warriors/icons/type.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 1024,
      sourceHeight: 1024,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "minionsWizardType",
      src: "../images/minions/wizards/icons/type.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 1024,
      sourceHeight: 1024,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "minionsHPDiamond",
      src: "../images/common_icons/minion_hp_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 202,
      sourceHeight: 204,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "eventsTypeCircle",
      src: "../images/common_icons/event_type_circle.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 150,
      sourceHeight: 147,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "eventsPrepTimeDiamond",
      src: "../images/common_icons/event_prep_time_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 181,
      sourceHeight: 184,
      destinationX: 10,
      destinationY: 70,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "eventsDurationDiamond",
      src: "../images/common_icons/event_duration_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 176,
      sourceHeight: 186,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "eventsEffectDiamond",
      src: "../images/common_icons/event_effect_diamond.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 194,
      sourceHeight: 199,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 110,
      smallVerDestinationHeight: 110,
      bigVerDestinationWidth: 0,
      bigVerDestinationHeight: 0,
    },
    {
      name: "weaponsMeleeType",
      src: "../images/weapons/icons/type_melee.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 512,
      sourceHeight: 512,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 20,
      smallVerDestinationHeight: 20,
      bigVerDestinationWidth: 35,
      bigVerDestinationHeight: 35,
    },
    {
      name: "weaponsMissileType",
      src: "../images/weapons/icons/type_missile.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 512,
      sourceHeight: 512,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 20,
      smallVerDestinationHeight: 20,
      bigVerDestinationWidth: 35,
      bigVerDestinationHeight: 35,
    },
    {
      name: "weaponsHybridType",
      src: "../images/weapons/icons/type_hybrid.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 500,
      sourceHeight: 500,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 20,
      smallVerDestinationHeight: 20,
      bigVerDestinationWidth: 35,
      bigVerDestinationHeight: 35,
    },
    {
      name: "armorLightType",
      src: "../images/armor/icons/type_light.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 512,
      sourceHeight: 512,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "armorMediumType",
      src: "../images/armor/icons/type_medium.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 512,
      sourceHeight: 512,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "armorHeavyType",
      src: "../images/armor/icons/type_heavy.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 200,
      sourceHeight: 200,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "specialType",
      src: "../images/special/icons/type.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 1080,
      sourceHeight: 1080,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
    {
      name: "rareType",
      src: "../images/rare/icons/type.png",
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 611,
      sourceHeight: 613,
      destinationX: 0,
      destinationY: 0,
      smallVerDestinationWidth: 35,
      smallVerDestinationHeight: 35,
      bigVerDestinationWidth: 50,
      bigVerDestinationHeight: 50,
    },
  ];

  createAndStoreImageInfoObjs(icons, globals.cardsIconsImgsInfo);
}

function createAndStoreImageInfoObjs(
  arrayOfSameTypeObjs,
  arrayToPutImageInfoObjsInto
) {
  for (let i = 0; i < arrayOfSameTypeObjs.length; i++) {
    const currentObj = arrayOfSameTypeObjs[i];

    const currentObjImage = new Image();
    currentObjImage.addEventListener("load", loadHandler, false);
    currentObjImage.src = currentObj.src;
    globals.assetsToLoad.push(currentObjImage);

    const currentObjImageInfo = new ImageInfo(
      currentObjImage,
      currentObj.sourceX,
      currentObj.sourceY,
      currentObj.sourceWidth,
      currentObj.sourceHeight,
      currentObj.destinationX,
      currentObj.destinationY,
      currentObj.smallVerDestinationWidth,
      currentObj.smallVerDestinationHeight,
      currentObj.bigVerDestinationWidth,
      currentObj.bigVerDestinationHeight
    );

    arrayToPutImageInfoObjsInto.push(currentObjImageInfo);
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
