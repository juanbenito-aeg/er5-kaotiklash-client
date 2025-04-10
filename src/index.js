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
  boardImage: {},
  cardsData: {},
  cardsReverseImage: {},
  cardsImages: {
    armor: [],
    main_characters: [],
    minions: [],
    rare_events: [],
    special_events: [],
    weapons: [],
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
  firstActivePlayerID: -1, // (!) DELETE AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
  phaseMessage: {},
  gameWinner: null,
  damageMessages: [],
  isScreenInitialized: {
    register: false,
    playerSession: false,
  },
  isParryMenuOpen: false,
  isPlayersSummonCharacterActive: [
    // PLAYER 1
    false,

    // PLAYER 2
    false,
  ],
  judgmentAncientsEventData: {
    isActive: false,
    affectedPlayerID: -1,
  },
  blessingWaitressCardData: {
    isEventActive: false,
    eventInstance: {},
  },
};

window.onload = initLogInScreen;

// HIDE/SHOW SCREEN FUNCTIONS

function hideRegisterAndShowLoginScreen() {
  hideRegisterScreen();

  showLoginScreen();
}

// LOGIN SCREEN
function showLoginScreen() {
  const loginForm = document.getElementById("login-form");
  loginForm.reset();

  const errorMessage = document.getElementById("login-error-message");
  errorMessage.textContent = "";

  const loginScreen = document.getElementById("login-screen");
  loginScreen.style.display = "block";
}
function hideLoginScreen() {
  const loginScreen = document.getElementById("login-screen");
  loginScreen.style.display = "none";
}

// REGISTER SCREEN
function showOrInitRegisterScreen() {
  hideLoginScreen();

  if (globals.isScreenInitialized.register) {
    showRegisterScreen();
  } else {
    initRegisterScreen();
  }
}
function showRegisterScreen() {
  const registerForm = document.getElementById("register-form");
  registerForm.reset();

  const errorMessage = document.getElementById("register-error-message");
  errorMessage.textContent = "";

  const registerScreen = document.getElementById("register-screen");
  registerScreen.style.display = "flex";
}
function hideRegisterScreen() {
  const registerScreen = document.getElementById("register-screen");
  registerScreen.style.display = "none";
}

// PLAYER SESSION SCREEN
function showPlayerSessionScreen() {
  const playerSessionScreen = document.getElementById("player-session-screen");
  playerSessionScreen.style.display = "flex";
}
function hidePlayerSessionScreen() {
  const playerSessionScreen = document.getElementById("player-session-screen");
  playerSessionScreen.style.display = "none";
}

// INITIALIZE SCREEN FUNCTIONS

function initLogInScreen() {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", checkFormDataAndLogIn);

  const loginScreenRegisterBtn = document.getElementById(
    "login-screen-register-btn"
  );
  loginScreenRegisterBtn.addEventListener("click", showOrInitRegisterScreen);

  const isPlayerAlreadyLoggedIn = localStorage.getItem("email");
  if (isPlayerAlreadyLoggedIn) {
    hideLoginScreen();

    // REDIRECT TO THE PLAYER SESSION SCREEN
    initPlayerSessionScreen();
  }
}

function checkFormDataAndLogIn(e) {
  e.preventDefault();

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  let emailInputValue = emailInput.value.trim().toLowerCase();
  let passwordInputValue = passwordInput.value.trim();

  logInPlayer(emailInputValue, passwordInputValue);
}

async function logInPlayer(email, password) {
  const errorMessage = document.getElementById("login-error-message");
  errorMessage.textContent = "";

  const url = "https://er5-kaotiklash-server.onrender.com/api/login";

  const playerData = {
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

  const data = await response.json();

  if (response.ok) {
    alert(data.message);

    localStorage.setItem("playerName", data.player.name);
    localStorage.setItem("email", data.player.email_address);

    hideLoginScreen();

    if (globals.isScreenInitialized.playerSession) {
      showPlayerSessionScreen();
    } else {
      initPlayerSessionScreen();
    }
  } else {
    errorMessage.textContent = data.message;
  }
}

function initRegisterScreen() {
  globals.isScreenInitialized.register = true;

  showRegisterScreen();

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", checkFormDataAndRegister);

  const registerScreenLoginBtn = document.getElementById(
    "register-screen-login-btn"
  );
  registerScreenLoginBtn.addEventListener(
    "click",
    hideRegisterAndShowLoginScreen
  );
}

function checkFormDataAndRegister(e) {
  e.preventDefault();

  const username = document.getElementById("name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  const errorMessage = document.getElementById("register-error-message");
  errorMessage.textContent = "";

  if (password !== confirmPassword) {
    errorMessage.textContent = "Error: The passwords do not match";
  } else {
    registerPlayer(username, email, password);
  }
}

async function registerPlayer(username, email, password) {
  const errorMessage = document.getElementById("register-error-message");

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

  const data = await response.json();

  if (response.ok) {
    alert(data.message);

    // AUTOMATICALLY REDIRECT TO LOGIN SCREEN AFTER REGISTERING
    window.location.reload();
  } else {
    errorMessage.textContent = data.message;
  }
}

function initPlayerSessionScreen() {
  globals.isScreenInitialized.playerSession = true;

  showPlayerSessionScreen();

  // GET THE LOGGED IN PLAYER'S DATA & INSERT IT INTO A PARAGRAPH ELEMENT

  const playerEmail = localStorage.getItem("email");
  const playerName = localStorage.getItem("playerName");

  const playerDataParagraph = document.getElementById("player-data");
  playerDataParagraph.innerHTML = `${playerEmail}<br>Hi, ${playerName}!`;

  // TERMINATE THE CURRENT SESSION WHEN THE "Log out" BUTTON IS PRESSED
  const logOutBtn = document.getElementById("log-out-btn");
  logOutBtn.addEventListener("click", clearLocalStorageAndReload);

  // GET OPPONENTS' DATA & USE THEM TO CREATE HTML ELEMENTS
  const opponentSelect = document.getElementById("opponent-select");
  createOpponentsSelOptions(playerName, opponentSelect);

  // ACTIVATE THE "Start Game" BUTTON WHEN AN OPPONENT IS SELECTED & DISABLE IT WHEN THE DEFAULT OPTION IS SELECTED AGAIN
  opponentSelect.addEventListener("change", activateOrDisableStartGameBtn);

  // START THE GAME WHEN THE CORRESPONDING BUTTON IS PRESSED
  const startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", hidePlayerSessionAndInitGameScreen);
}

function clearLocalStorageAndReload() {
  localStorage.clear();

  window.location.reload();
}

async function createOpponentsSelOptions(playerName, opponentSelect) {
  const url =
    "https://er5-kaotiklash-server.onrender.com/api/players/opponent-names";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerName }),
  });

  let opponentNames;

  if (response.ok) {
    opponentNames = await response.json();
  } else {
    alert(`Communication error: ${response.statusText}`);
  }

  for (let i = 0; i < opponentNames.length; i++) {
    const currentOpponentName = opponentNames[i].name;
    const currentOpponentSelOption = new Option(currentOpponentName);
    opponentSelect.appendChild(currentOpponentSelOption);
  }
}

function activateOrDisableStartGameBtn(e) {
  const startGameBtn = document.getElementById("start-game-btn");

  if (e.target.value) {
    startGameBtn.disabled = false;
  } else {
    startGameBtn.disabled = true;
  }
}

function hidePlayerSessionAndInitGameScreen() {
  hidePlayerSessionScreen();

  initGameScreen();
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
  const url = "https://er5-kaotiklash-server.onrender.com/api/cards/";

  const response = await fetch(url);

  if (response.ok) {
    const cardsData = await response.json();

    globals.cardsData = cardsData;
  } else {
    alert(`Communication error: ${response.statusText}`);
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
