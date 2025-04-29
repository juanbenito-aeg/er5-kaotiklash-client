import Game from "./Game/Game.js";
import globals from "./Game/globals.js";
import { GameState, FPS, Language } from "./Game/constants.js";
import { PlayerID } from "./Game/constants.js";

window.onload = initEssentials;

async function initEssentials() {
  initInnDoor();
  initLanguageBtns();

  // SHOW THE WEBSITE IN THE USER'S PREFERRED LANGUAGE (OR IN ENGLISH BY DEFAULT)
  const preferredLanguage = localStorage.getItem("language") || "eng";
  const languageData = await loadLanguageData(preferredLanguage);
  updateContent(languageData);

  globals.language =
    preferredLanguage === "eng" ? Language.ENGLISH : Language.BASQUE;

  const isPlayerAlreadyLoggedIn = localStorage.getItem("email");
  if (isPlayerAlreadyLoggedIn) {
    hideMainScreen();

    // REDIRECT TO THE PLAYER SESSION SCREEN
    initPlayerSessionScreen();
  }
}

function initInnDoor() {
  const innDoor = document.getElementById("main-screen-inn-door");
  innDoor.addEventListener("click", initLoginScreen);
}

function initLanguageBtns() {
  const languageBtns = document.querySelectorAll("#lang-btns > *");

  for (let i = 0; i < languageBtns.length; i++) {
    languageBtns[i].addEventListener("click", changeLanguage);
  }
}

async function changeLanguage(e) {
  const languageBtnID = e.target.getAttribute("id");
  const language = languageBtnID === "eng-btn" ? "eng" : "eus";

  setLanguagePreference(language);

  const languageData = await loadLanguageData(language);
  updateContent(languageData);

  globals.language = language === "eng" ? Language.ENGLISH : Language.BASQUE;

  clearErrorMessages();
  setUpGameTips();
}

function setLanguagePreference(language) {
  localStorage.setItem("language", language);
}

async function loadLanguageData(language) {
  const response = await fetch(`./src/${language}Content.json`);
  const languageData = await response.json();
  return languageData;
}

function updateContent(languageData) {
  const contentToUpdate = document.querySelectorAll("[data-i18n]");

  for (let i = 0; i < contentToUpdate.length; i++) {
    const currentElement = contentToUpdate[i];
    const keyToLookFor = currentElement.getAttribute("data-i18n");
    currentElement.innerHTML = languageData[keyToLookFor];
  }
}

function clearErrorMessages() {
  const errorMessages = document.querySelectorAll(".error-message");

  for (let i = 0; i < errorMessages.length; i++) {
    errorMessages[i].innerHTML = "";
  }
}

// HIDE/SHOW "X" FUNCTIONS

function hideRegisterAndShowLoginScreen() {
  hideRegisterScreen();

  showLoginScreen();
}

// MAIN SCREEN
function hideMainScreen() {
  const mainScreen = document.getElementById("main-screen");
  mainScreen.style.display = "none";
}

// LANGUAGE BUTTONS
function showLanguageBtns() {
  const languageBtnsContainer = document.getElementById("lang-btns");
  languageBtnsContainer.style.display = "block";
}
function hideLanguageBtns() {
  const languageBtnsContainer = document.getElementById("lang-btns");
  languageBtnsContainer.style.display = "none";
}

// LOGIN SCREEN
function showLoginScreen() {
  const loginForm = document.getElementById("login-form");
  loginForm.reset();

  clearErrorMessages();

  const loginScreen = document.getElementById("login-screen");
  loginScreen.style.display = "flex";
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

  clearErrorMessages();

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

function initLoginScreen() {
  hideMainScreen();

  showLoginScreen();
  showLanguageBtns();

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", checkFormDataAndLogIn);

  const loginScreenRegisterBtn = document.getElementById(
    "login-screen-register-btn"
  );
  loginScreenRegisterBtn.addEventListener("click", showOrInitRegisterScreen);
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
  clearErrorMessages();

  const url = "https://er5-kaotiklash-server.onrender.com/api/login";

  const preferredLanguage = localStorage.getItem("language") || "eng";
  const playerData = {
    email_address: email,
    password: password,
    preferred_language: preferredLanguage,
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
    localStorage.setItem("playerID", data.player.player_id);
    localStorage.setItem("playerName", data.player.name);
    localStorage.setItem("email", data.player.email_address);

    hideLoginScreen();

    initPlayerSessionScreen();
  } else {
    const errorMessage = document.getElementById("login-error-message");
    errorMessage.innerHTML = data.message;
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

  clearErrorMessages();

  const username = document.getElementById("name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    const passwordsMismatchMsg =
      globals.language === Language.ENGLISH
        ? "Error: The passwords do not match"
        : "Errorea: pasahitzak ez datoz bat";

    const errorMessage = document.getElementById("register-error-message");
    errorMessage.innerHTML = passwordsMismatchMsg;
  } else {
    registerPlayer(username, email, password);
  }
}

async function registerPlayer(username, email, password) {
  const errorMessage = document.getElementById("register-error-message");

  const url = "https://er5-kaotiklash-server.onrender.com/api/players";

  const preferredLanguage = localStorage.getItem("language") || "eng";
  const playerData = {
    name: username,
    email_address: email,
    password: password,
    preferred_language: preferredLanguage,
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

    // AUTOMATICALLY REDIRECT TO THE MAIN SCREEN AFTER REGISTERING
    window.location.reload();
  } else {
    errorMessage.innerHTML = data.message;
  }
}

function initPlayerSessionScreen() {
  showPlayerSessionScreen();
  showLanguageBtns();

  globals.playersIDs.loggedIn = localStorage.getItem("playerID");

  // GET THE LOGGED IN PLAYER'S DATA & INSERT IT INTO A PARAGRAPH ELEMENT

  const playerEmail = localStorage.getItem("email");
  const playerEmailParagraph = document.getElementById("player-email");
  playerEmailParagraph.innerHTML = playerEmail;

  const playerName = localStorage.getItem("playerName");
  const playerNameParagraph = document.getElementById("player-name");
  playerNameParagraph.innerHTML += `, ${playerName}!`;

  // TERMINATE THE CURRENT SESSION WHEN THE "Log out" BUTTON IS PRESSED
  const logOutBtn = document.getElementById("log-out-btn");
  logOutBtn.addEventListener("click", clearLocalStorageAndReload);

  //STATS BUTTON
  const statsBtn = document.getElementById("stats-btn");
  statsBtn.addEventListener("click", showStatsScreen);

  // GET OPPONENTS' DATA & USE THEM TO CREATE HTML ELEMENTS
  const opponentSelect = document.getElementById("opponent-select");
  createOpponentsSelOptions(opponentSelect);

  //RANDOM TIPS FOR THE PLAYER
  setUpGameTips();

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

async function createOpponentsSelOptions(opponentSelect) {
  const url =
    "https://er5-kaotiklash-server.onrender.com/api/players/opponents-data";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loggedInPlayerID: globals.playersIDs.loggedIn }),
  });

  let opponentNames;

  if (response.ok) {
    opponentNames = await response.json();
  } else {
    alert(`Communication error: ${response.statusText}`);
  }

  for (let i = 0; i < opponentNames.length; i++) {
    const currentOpponentID = opponentNames[i].player_id;
    const currentOpponentName = opponentNames[i].name;
    const currentOpponentSelOption = new Option(
      currentOpponentName,
      currentOpponentID
    );
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

function showStatsScreen() {
  //INSERT THE FUNCTION FOR THE ALL GET STATS
  hideLanguageBtns();
  hidePlayerSessionScreen();
  const statsScreen = document.getElementById("stats-screen");
  statsScreen.style.display = "flex";
  showStats(globals.playersIDs.loggedIn);
  const exit = document.getElementById("stats-btn-exit");
  exit.addEventListener("click", hideStatsScreen);
}

async function showStats(loggedInPlayerID) {
  await getWinRate(loggedInPlayerID);
  await getMinionsKilled(loggedInPlayerID);
  await getFumbles(loggedInPlayerID);
}

async function getWinRate(loggedInPlayerID) {
  let wins = 0;
  let totalMatches = 0;

  const urlWins = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/winned-matches`;
  const responseWins = await fetch(urlWins, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (responseWins.ok) {
    wins = await responseWins.json();
  } else {
    alert(`Communication error (wins): ${responseWins.statusText}`);
    return;
  }

  const urlMatches = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-matches`;
  const responseMatches = await fetch(urlMatches, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (responseMatches.ok) {
    totalMatches = await responseMatches.json();
  } else {
    alert(`Communication error (matches): ${responseMatches.statusText}`);
    return;
  }

  const winRate = (wins / totalMatches) * 100;
  console.log(`Win rate: ${winRate.toFixed(2)}%`);
}

async function getMinionsKilled(loggedInPlayerID) {
  let killedMinions = 0;
  
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-minions-killed`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    killedMinions = await response.json();
  } else {
    alert(`Communication error (minions killed): ${response.statusText}`);
    return;
  }

  console.log(`Total minions killed: ${killedMinions}`);
}

async function getFumbles(loggedInPlayerID) {
  let fumbles = 0;
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-minions-killed`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    fumbles = await response.json();
  } else {
    alert(`Communication error (fumbles): ${response.statusText}`);
    return;
  }

  console.log(`Total fumbles: ${fumbles}`);
}

function hideStatsScreen() {
  const statsScreen = document.getElementById("stats-screen");
  statsScreen.style.display = "none";

  showPlayerSessionScreen();
}

function setUpGameTips() {
  const tips = {
    [Language.ENGLISH]: [
      "Old gambler's wisdom: 'When in doubt, blame the tavern wench!'",
      "A good hand beats a strong arm. Usually.",
      "Bartender's advice: 'The card up your sleeve should stay there!'",
      "Drunkard's tip: 'Count your cards, not your drinks!'",
      "Bar fight wisdom: 'Cheat first, apologize later'",
      "Grizzled mercenary mutters: 'Fold early, live longer'",
      "Tavern rule #7: 'Never gamble with a man named 'Two-Thumbs''",
      "Sage gambler's tip: 'Never trust a man who orders water at the bar!'",
      "Barkeep’s wisdom: 'The best way to fold is to do it with style!'",
      "Tavern wisdom: 'If you can't win a fight, make sure you're too drunk to care!'",
      "Drunken fighter’s rule: 'The only thing that beats a punch is a well-timed burp!'",
    ],
    [Language.BASQUE]: [
      "Jokalari zaharren jakinduria: 'Zalantza baduzu, blame tabernako neskari!'",
      "Esku ona beso indartsua gainditzen du. Ohikoan.",
      "Tabernariaren aholkua: 'Mahukako karta han egon behar da!'",
      "Mozkorren aholkua: 'Kontatu zure kartak, ez zure edariak!'",
      "Taberna-liskar jakinduria: 'Engainatu lehen, barkatu gero'",
      "Mertzenario zaharrak marmar: 'Laster utzi, luzaroago bizi'",
      "Taberna araua #7: 'Ez jokatu inoiz Bi Erizo ezizeneko gizonekin'",
      "Jokalari zaharren aholkua: 'Ez fidatu tabernan ura eskatzen duen gizonarekin!'",
      "Tabernariaren jakinduria: 'Txarto jokatzen duzun karta, estiloz jokatuz ordaindu!'",
      "Taberna jakinduria: 'Borrokaren hasierako momentuan ezin baduzu irabazi, ziurtatu edateko momentu gutxienekoa izatea!'",
      "Mozkor borrokalarien araua: 'Kolpe batek ez du ezer irabazten, burp batek baizik!'",
    ],
  };

  const currentLang = globals.language;
  const randomTip =
    tips[currentLang][Math.floor(Math.random() * tips[currentLang].length)];
  document.getElementById("game-tip").textContent = randomTip;
}

function hidePlayerSessionAndInitGameScreen() {
  hidePlayerSessionScreen();

  initGameScreen();
}

async function initGameScreen() {
  hideLanguageBtns();

  initVars();

  // INITIALIZE CANVAS AND ITS CONTEXT
  globals.canvas = document.getElementById("game-screen");
  globals.canvas.style.display = "block";
  globals.ctx = globals.canvas.getContext("2d");

  // LOAD DB CARDS DATA AND ASSETS
  loadDBCardsDataAndAssets();
}

function initVars() {
  const opponentSelect = document.getElementById("opponent-select");
  globals.playersIDs.lastOpponent = opponentSelect.value;

  // INITIALIZE TIME MANAGEMENT VARIABLES
  globals.previousCycleMilliseconds = 0;
  globals.deltaTime = 0;
  globals.frameTimeObj = 1 / FPS;

  globals.imagesDestinationSizes = {
    allCardsBigVersion: {
      width: 550,
      height: 625,
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

  if (globals.gameOver && !globals.statsAlreadySent) {
    globals.statsAlreadySent = true;
    let duration_ms = Date.now() - globals.gameStats.game_start_time;
    let minutes = Math.floor(duration_ms / 60000);
    let seconds = Math.round((duration_ms % 60000) / 1000);
    let duration_in_minutes = minutes;
    let date = new Date().toISOString().split("T")[0];
    let player1 = globals.gamePlayers[0];
    let player2 = globals.gamePlayers[1];
    let winnerID;
    if (globals.gameWinner.getID() === PlayerID.PLAYER_1) {
      winnerID = globals.playersIDs.loggedIn;
    } else if (globals.gameWinner.getID() === PlayerID.PLAYER_2) {
      winnerID = globals.playersIDs.lastOpponent;
    }

    saveGameData(
      globals.playersIDs.loggedIn,
      globals.playersIDs.lastOpponent,
      winnerID,
      date,
      duration_in_minutes,
      globals.gameStats.played_turns,
      globals.gameStats.joseph_appeared,
      player1.getMinionsKilled(),
      player2.getMinionsKilled(),
      player1.getFumbles(),
      player2.getFumbles(),
      player1.getCriticalHits(),
      player2.getCriticalHits(),
      player1.getUsedCards(),
      player2.getUsedCards()
    );
  }

  async function saveGameData(
    loggedInPlayerID,
    lastOpponentID,
    winnerID,
    date,
    duration_in_minutes,
    played_rounds,
    joseph_appeared,
    player_1_minions_killed,
    player_2_minions_killed,
    player_1_fumbles,
    player_2_fumbles,
    player_1_critical_hits,
    player_2_critical_hits,
    player_1_used_cards,
    player_2_used_cards
  ) {
    const url = "https://er5-kaotiklash-server.onrender.com/api/player_stats";

    const gameData = {
      player_1: loggedInPlayerID,
      player_2: lastOpponentID,
      winner: winnerID,
      date: date,
      duration_in_minutes: duration_in_minutes,
      played_rounds: played_rounds,
      joseph_appeared: joseph_appeared,
      player_1_minions_killed: player_1_minions_killed,
      player_2_minions_killed: player_2_minions_killed,
      player_1_fumbles: player_1_fumbles,
      player_2_fumbles: player_2_fumbles,
      player_1_critical_hits: player_1_critical_hits,
      player_2_critical_hits: player_2_critical_hits,
      player_1_used_cards: player_1_used_cards,
      player_2_used_cards: player_2_used_cards,
    };

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    });

    if (response.ok) {
      console.log("Game data saved successfully");
    } else {
      console.error("Error saving game data:", response.statusText);
    }

    globals.gameOver = false;
  }
}
