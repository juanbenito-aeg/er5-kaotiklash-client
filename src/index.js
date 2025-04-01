import Game from "./Game/Game.js";
import { GameState, FPS } from "./Game/constants.js";
import PhasesMessages from "./Messages/PhasesMessages.js";
import DamageMessages from "./Messages/DamageMessage.js";

// GLOBAL VARIABLES CREATION
const globals = {
  previousCycleMilliseconds: -1, // PREVIOUS CYCLE TIME (MILLISECONDS)
  deltaTime: 0, // ACTUAL GAME CYCLE TIME (SECONDS)
  frameTimeObj: 0, // GOAL CYCLE TIME (SECONDS, CONSTANT)
  cycleRealTime: 0,
  canvas: {},
  ctx: {},
  boardImage: {},
  cardsData: {},
  cardsReverseImage: {},
  cardsImages: {
    mainCharacters: [],
    minions: [],
    weapons: [],
    armor: [],
    specialEvents: [],
    rareEvents: [],
  },
  cardsTemplatesImages: [],
  cardsIconsImages: [],
  imagesDestinationSizes: {},
  assetsToLoad: [], // HOLDS THE ELEMENTS TO LOAD
  assetsLoaded: 0, // INDICATES THE NUMBER OF ELEMENTS THAT HAVE BEEN LOADED SO FAR
  gameState: GameState.INVALID,
  game: {},
  language: 0,
  isCurrentTurnFinished: false,
  buttonDataGlobal: [],
  // (!!!!!) DELETE AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
  firstActivePlayerID: -1,
  phasesMessages: [],
  currentPhase: 0,
  currentState: 0,
  phaseType: -1,
  gameWinner: null,
  damageMessages: [],
  damageFontSize: 75,
};

window.onload = initLogInScreen;

function initRegisterScreen() {
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
      alert("Please complete all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Error the password dont match");
      return;
    }
    registerPlayer(username, email, password);
    alert("Successful registration");
  });
}

async function registerPlayer(username, email, password) {
  const url = "https://er5-kaotiklash-server.onrender.com/api/players";
  const playerData = {
    name: username,
    email_address: email,
    password: password,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(playerData),
  });

  if (response.ok) {
    const data = await response.json();
    alert("Registration successful!");
    console.log(data);
    initGameScreen();
  } else {
    const errorData = await response.json();
    alert(`Error: ${errorData.message || response.statusText}`);
  }
}

function initLogInScreen() {
  const logInForm = document.getElementById("log-in-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const checkbox = document.getElementById("localStorage-checkbox");

  const savedEmail = localStorage.getItem("email");
  const isChecked = localStorage.getItem("checkboxState") === "true";

  if (savedEmail) {
    emailInput.value = savedEmail;
    checkbox.checked = isChecked;
    initStartGameScreen(); // Saltar el login y proceder al juego

  }

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      localStorage.setItem("checkboxState", "true");
      if (emailInput.value.trim()) {
        localStorage.setItem("email", emailInput.value.trim().toLowerCase());
      }
    } else {
      localStorage.removeItem("checkboxState");
      localStorage.removeItem("email");
    }
  });

  logInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let email = emailInput.value.trim().toLowerCase();
    let password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (checkbox.checked) {
      localStorage.setItem("email", email);
    }

    logInPlayer(email, password);
  });
}

async function logInPlayer(email, password) {
  const url = "https://er5-kaotiklash-server.onrender.com/api/players";
  const playerData = {
    email: email,
    password: password,
  };

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    let loginSuccessful = false;

    // Primero verificamos si el email existe
    for (let i = 0; i < data.length; i++) {
      if (data[i].email_address === playerData.email) {
        // Si el email es correcto, verificamos la contraseña
        if (data[i].password === playerData.password) {
          loginSuccessful = true;
          alert("Log in successful!");

          // Guardar el nombre del jugador
          localStorage.setItem("playerName", data[i].name);

          initPlayerSessionScreen();
          break; // Si encontramos una coincidencia, salimos del bucle
        } else {
          alert("Incorrect password!");
          break; // Si la contraseña no es correcta, salimos del bucle
        }
      }
    }

    if (!loginSuccessful) {
      alert("Email not found!");
    }
  } else {
    const errorData = await response.json();
    alert(`Error: ${errorData.message || response.statusText}`);
  }
}

async function initGameScreen() {

  initVars();

  // INITIALIZE CANVAS AND ITS CONTEXT
  globals.canvas = document.getElementById("game-screen");
  globals.canvas.style.display = "block";
  globals.ctx = globals.canvas.getContext("2d");

  // LOAD DB CARDS DATA AND ASSETS
  loadDBCardsDataAndAssets();
}

function initVars() {
  // INITIALIZE TIME MANAGEMENT VARIABLES
  globals.previousCycleMilliseconds = 0;
  globals.deltaTime = 0;
  globals.frameTimeObj = 1 / FPS;

  globals.imagesDestinationSizes = {
    allCardsBigVersion: {
      width: 425,
      height: 501,
    },
    mainCharactersSmallVersion: {
      width: 200,
      height: 200,
    },
    minionsAndEventsSmallVersion: {
      width: 110,
      height: 110,
    },
  };
}

async function loadDBCardsDataAndAssets() {
  // API ENDPOINTS TO RETRIEVE CARDS DATA FROM THE DATABASE
  const urls = {
    mainCharacters:
      "https://er5-kaotiklash-server.onrender.com/api/main-characters/",
    minions: "https://er5-kaotiklash-server.onrender.com/api/minions/",
    weapons: "https://er5-kaotiklash-server.onrender.com/api/weapons/",
    armor: "https://er5-kaotiklash-server.onrender.com/api/armor/",
    specialEvents:
      "https://er5-kaotiklash-server.onrender.com/api/special-events/",
    rareEvents: "https://er5-kaotiklash-server.onrender.com/api/rare-events/",
  };

  for (const urlName in urls) {
    const response = await fetch(urls[urlName]);

    if (response.ok) {
      globals.cardsData[urlName] = await response.json();
    } else {
      alert(`Communication error: ${response.statusText}`);
    }
  }

  loadAssets();
}

function loadAssets() {
  // LOAD BOARD IMAGE
  globals.boardImage = new Image();
  globals.boardImage.addEventListener("load", loadHandler, false);
  globals.boardImage.src = "../images/board.jpg";
  globals.assetsToLoad.push(globals.boardImage);

  // LOAD CARDS REVERSE
  globals.cardsReverseImage = new Image();
  globals.cardsReverseImage.addEventListener("load", loadHandler, false);
  globals.cardsReverseImage.src = "../images/reverse.png";
  globals.assetsToLoad.push(globals.cardsReverseImage);

  // LOAD CARDS IMAGES
  for (const cardCategory in globals.cardsData) {
    createAndStoreImageObjs(
      globals.cardsData[cardCategory],
      globals.cardsImages[cardCategory]
    );
  }

  // LOAD CARDS TEMPLATES

  const templates = [
    {
      name: "mainCharactersSmall",
      image_src: "../images/main_characters/templates/version_small.png",
    },
    {
      name: "minions&EventsSmall",
      image_src: "../images/common_templates/version_small_minion_event.png",
    },
    {
      name: "rareEventBig",
      image_src: "../images/rare/templates/version_big.png",
    },
    {
      name: "specialEventBig",
      image_src: "../images/special/templates/version_big.png",
    },
    {
      name: "minionWarriorBig",
      image_src: "../images/minions/warriors/templates/version_big.png",
    },
    {
      name: "minionWizardBig",
      image_src: "../images/minions/wizards/templates/version_big.png",
    },
    {
      name: "minionSpecialBig",
      image_src: "../images/minions/special/templates/version_big.png",
    },
    {
      name: "JosephBig",
      image_src: "../images/main_characters/templates/version_big_joseph.png",
    },
    {
      name: "mainCharacterBig",
      image_src: "../images/main_characters/templates/version_big.png",
    },
    {
      name: "armorMediumBig",
      image_src: "../images/armor/templates/type_medium.png",
    },
    {
      name: "armorHeavy&LightBig",
      image_src: "../images/armor/templates/types_light_heavy.png",
    },
    {
      name: "weaponBig",
      image_src: "../images/weapons/templates/version_big.png",
    },
  ];

  createAndStoreImageObjs(templates, globals.cardsTemplatesImages);

  // LOAD CARDS ICONS

  const icons = [
    {
      name: "attackDamageDiamond",
      image_src: "../images/common_icons/attack_dmg_diamond.png",
    },
    {
      name: "defenseDurabilityDiamond",
      image_src: "../images/common_icons/defense_durability_diamond.png",
    },
    {
      name: "minionsSpecialType",
      image_src: "../images/minions/special/icons/type.png",
    },
    {
      name: "minionsWarriorType",
      image_src: "../images/minions/warriors/icons/type.png",
    },
    {
      name: "minionsWizardType",
      image_src: "../images/minions/wizards/icons/type.png",
    },
    {
      name: "minionsHPDiamond",
      image_src: "../images/common_icons/minion_hp_diamond.png",
    },
    {
      name: "eventsTypeCircle",
      image_src: "../images/common_icons/event_type_circle.png",
    },
    {
      name: "eventsPrepTimeDiamond",
      image_src: "../images/common_icons/event_prep_time_diamond.png",
    },
    {
      name: "eventsDurationDiamond",
      image_src: "../images/common_icons/event_duration_diamond.png",
    },
    {
      name: "eventsEffectDiamond",
      image_src: "../images/common_icons/event_effect_diamond.png",
    },
    {
      name: "weaponsMeleeType",
      image_src: "../images/weapons/icons/type_melee.png",
    },
    {
      name: "weaponsMissileType",
      image_src: "../images/weapons/icons/type_missile.png",
    },
    {
      name: "weaponsHybridType",
      image_src: "../images/weapons/icons/type_hybrid.png",
    },
    {
      name: "armorLightType",
      image_src: "../images/armor/icons/type_light.png",
    },
    {
      name: "armorMediumType",
      image_src: "../images/armor/icons/type_medium.png",
    },
    {
      name: "armorHeavyType",
      image_src: "../images/armor/icons/type_heavy.png",
    },
    {
      name: "specialType",
      image_src: "../images/special/icons/type.png",
    },
    {
      name: "rareType",
      image_src: "../images/rare/icons/type.png",
    },
    {
      name: "minionsHP",
      image_src: "../images/common_icons/minion_hp.png",
    },
    {
      name: "minionsMadness",
      image_src: "../images/common_icons/minion_madness.png",
    },
    {
      name: "minionsAttack",
      image_src: "../images/common_icons/minion_attack.png",
    },
    {
      name: "minionsDefense",
      image_src: "../images/common_icons/minion_defense.png",
    },
    {
      name: "weaponsDamage",
      image_src: "../images/weapons/icons/attribute_damage.png",
    },
    {
      name: "weaponsArmorDurability",
      image_src: "../images/common_icons/weapon_armor_durability.png",
    },
    {
      name: "eventsPrepTime",
      image_src: "../images/common_icons/event_prep_time.png",
    },
    {
      name: "eventsEffect",
      image_src: "../images/common_icons/event_effect.png",
    },
    {
      name: "eventsDuration",
      image_src: "../images/common_icons/event_duration.png",
    },
  ];

  createAndStoreImageObjs(icons, globals.cardsIconsImages);
}

// CODE BLOCK TO CALL EACH TIME AN ASSET IS LOADED
async function loadHandler() {
  globals.assetsLoaded++;
  if (globals.assetsLoaded === globals.assetsToLoad.length) {
    globals.gameState = GameState.PLAYING;

    globals.game = await Game.create();

    // FIRST FRAME REQUEST
    window.requestAnimationFrame(executeGameLoop);
  }
}

function createAndStoreImageObjs(arrayOfSameTypeObjs, arrayToPutImageObjsInto) {
  for (let i = 0; i < arrayOfSameTypeObjs.length; i++) {
    const currentObj = arrayOfSameTypeObjs[i];

    const currentObjImage = new Image();
    currentObjImage.addEventListener("load", loadHandler, false);
    currentObjImage.src = currentObj.image_src;
    globals.assetsToLoad.push(currentObjImage);

    arrayToPutImageObjsInto.push(currentObjImage);
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

export { globals };
