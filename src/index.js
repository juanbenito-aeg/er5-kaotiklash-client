import Game from "./Game/Game.js";
import globals from "./Game/globals.js";
import { GameState, FPS, Language, ChartID, Music } from "./Game/constants.js";

window.onload = initEssentials;

async function initEssentials() {
  loadInitialMusic();
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
  checkIfMusicIsPlayingAndIfSoReset();
  setMusic(Music.TAVERN_MUSIC);
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

function hideStatsAndShowPlayerSessionScreen() {
  const statsScreen = document.getElementById("stats-screen");
  statsScreen.style.display = "none";

  showPlayerSessionScreen();
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

  if (!globals.isScreenInitialized.register) {
    initRegisterScreen();
  }

  showRegisterScreen();
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

  showLanguageBtns();

  // RANDOM TIPS FOR THE PLAYER
  setUpGameTips();
}
function hidePlayerSessionScreen() {
  const playerSessionScreen = document.getElementById("player-session-screen");
  playerSessionScreen.style.display = "none";
}

// STATS SCREEN
function showOrInitStatsScreen() {
  hideLanguageBtns();
  hidePlayerSessionScreen();

  if (!globals.isScreenInitialized.stats) {
    initStatsScreen();
  }

  showStatsScreen();
}
function showStatsScreen() {
  const statsScreen = document.getElementById("stats-screen");
  statsScreen.style.display = "flex";
}

function hideChartSelector() {
  const chartSelector = document.getElementById("chart-selector");
  chartSelector.style.display = "none";
}

function hideChartDisplayAndShowChartSelector() {
  const chartDisplay = document.getElementById("chart-display");
  chartDisplay.style.display = "none";

  const chartSelector = document.getElementById("chart-selector");
  chartSelector.style.display = "grid";
}

// INITIALIZE SCREEN FUNCTIONS

function initLoginScreen() {
  hideMainScreen();

  showLoginScreen();
  showLanguageBtns();

  checkIfMusicIsPlayingAndIfSoReset();
  setMusic(Music.LOGIN_REGISTER_MUSIC);

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

  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", checkFormDataAndRegister);

  checkIfMusicIsPlayingAndIfSoReset();
  setMusic(Music.LOGIN_REGISTER_MUSIC);

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
  if (!globals.isScreenInitialized.playerSessionScreen) {
    globals.isScreenInitialized.playerSessionScreen = true;

    const playerName = localStorage.getItem("playerName");
    const playerNameParagraph = document.getElementById("player-name");
    playerNameParagraph.innerHTML += `, ${playerName}!`;
  }

  const playerEmail = localStorage.getItem("email");
  const playerEmailParagraph = document.getElementById("player-email");
  playerEmailParagraph.innerHTML = playerEmail;

  showPlayerSessionScreen();

  checkIfMusicIsPlayingAndIfSoReset();
  setMusic(Music.PLAYER_SESSION_MUSIC);

  globals.playersIDs.loggedIn = localStorage.getItem("playerID");

  // TERMINATE THE CURRENT SESSION WHEN THE "Log out" BUTTON IS PRESSED
  const logOutBtn = document.getElementById("log-out-btn");
  logOutBtn.addEventListener("click", clearLocalStorageAndReload);

  // STATS BUTTON
  const statsBtn = document.getElementById("stats-btn");
  statsBtn.addEventListener("click", showOrInitStatsScreen);

  // GET OPPONENTS' DATA & USE THEM TO CREATE HTML ELEMENTS
  const opponentSelect = document.getElementById("opponent-select");
  createOpponentsSelOptions(opponentSelect);

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

function initStatsScreen() {
  globals.isScreenInitialized.stats = true;

  // SECTION: CHART SELECTOR

  const chartSelectorExitBtn = document.getElementById(
    "chart-selector-exit-btn"
  );
  chartSelectorExitBtn.addEventListener(
    "click",
    hideStatsAndShowPlayerSessionScreen
  );

  const chartSelectorChartBtns = document.querySelectorAll(
    ".chart-selector-chart-btn"
  );
  for (let i = 0; i < chartSelectorChartBtns.length; i++) {
    const currentChartSelectorChartBtn = chartSelectorChartBtns[i];

    currentChartSelectorChartBtn.addEventListener("click", showChartDisplay);
  }

  // SECTION: CHART DISPLAY

  const chartDisplayReturnBtn = document.getElementById(
    "chart-display-return-btn"
  );
  chartDisplayReturnBtn.addEventListener(
    "click",
    hideChartDisplayAndShowChartSelector
  );

  setChartsDefaultProperties();
}

function setChartsDefaultProperties() {
  Chart.defaults.color = "rgb(255, 255, 255)";
  Chart.defaults.font.family = "MedievalSharp";
  Chart.defaults.font.size = 16;
  Chart.defaults.plugins.tooltip.boxPadding = 3;
  Chart.defaults.maintainAspectRatio = false;
}

function showChartDisplay(e) {
  hideChartSelector();

  const chartDisplay = document.getElementById("chart-display");
  chartDisplay.style.display = "grid";

  const chartSelectorChartBtns = document.querySelectorAll(
    ".chart-selector-chart-btn"
  );
  for (let i = 0; i < chartSelectorChartBtns.length; i++) {
    const currentChartSelectorChartBtn = chartSelectorChartBtns[i];

    if (e.target === currentChartSelectorChartBtn) {
      createOrDisplayChart(i);
    }
  }
}

async function createOrDisplayChart(chartID) {
  let chartDisplayHeadingString;

  switch (chartID) {
    case ChartID.WIN_RATE:
      chartDisplayHeadingString = "WIN RATE";
      if (!globals.isChartCreated.winRate) {
        const winRate = await getWinRate();

        if (winRate) {
          createWinRateChart(winRate);
        }
      }
      break;

    case ChartID.TURNS_PER_MATCH:
      chartDisplayHeadingString = "TURNS PER MATCH";
      if (!globals.isChartCreated.turnsPerMatch) {
        const playedTurnsData = await getTotalPlayedTurns(
          globals.playersIDs.loggedIn
        );

        if (playedTurnsData) {
          createTurnsPerMatchChart(playedTurnsData);
        }
      }
      break;

    case ChartID.JOSEPH_APPEARANCES:
      chartDisplayHeadingString = "JOSEPH APPEARANCES";
      if (!globals.isChartCreated.josephAppearances) {
        const appearances = await getJosephAppearances(
          globals.playersIDs.loggedIn
        );

        if (appearances) {
          createJosephAppearancesChart(appearances);
        }
      }
      break;

    case ChartID.MINIONS_KILLED:
      chartDisplayHeadingString = "MINIONS KILLED";
      if (!globals.isChartCreated.minionsKilled) {
        const response = await getMinionsKilled(globals.playersIDs.loggedIn);

        if (response) {
          const total = {
            total_killed: response.total_minions_killed,
            average_killed: response.average_minions_killed,
          };
          createMinionsKilledChart(total);
        }
      }
      break;

    case ChartID.FUMBLES_PER_MATCH:
      chartDisplayHeadingString = "FUMBLES PER MATCH";
      if (!globals.isChartCreated.fumblesPerMatch) {
        const fumblesData = await getFumblesData();

        if (fumblesData) {
          createFumblesPerMatchChart(fumblesData);
        }
      }
      break;

    case ChartID.CRITICAL_HITS_PER_MATCH:
      chartDisplayHeadingString = "CRITICAL HITS PER MATCH";
      if (!globals.isChartCreated.criticalHitsPerMatch) {
        const criticalHitsData = await getCriticalHitsData();

        if (criticalHitsData) {
          createCriticalHitsPerMatchChart(criticalHitsData);
        }
      }
      break;

    case ChartID.USED_CARDS:
      chartDisplayHeadingString = "USED CARDS";
      if (!globals.isChartCreated.usedCards) {
        const usedCardsData = await getUsedCards(globals.playersIDs.loggedIn);

        if (usedCardsData) {
          createUsedCardsChart(usedCardsData);
        }
      }
      break;
  }

  const chartDisplayHeading = document.getElementById("chart-display-heading");
  chartDisplayHeading.innerHTML = chartDisplayHeadingString;

  displayChart(chartID);
}

function createWinRateChart(winRate) {
  const data = {
    labels: ["Won Matches", "Lost Matches"],
    datasets: [
      {
        data: [winRate.won_matches, winRate.lost_matches],
      },
    ],
  };

  const config = {
    type: "pie",
    data,
  };

  new Chart(document.getElementById("win-rate"), config);
  globals.isChartCreated.winRate = true;
}

function getGameStartAndEndDates(gameData) {
  const gameStartAndEndDates = [
    gameData.start_timestamp_in_ms,
    gameData.end_timestamp_in_ms,
  ];

  for (let i = 0; i < gameStartAndEndDates.length; i++) {
    const startOrEndString = i === 0 ? "Start: " : "End: ";

    const currentDateString = new Date(
      gameStartAndEndDates[i]
    ).toLocaleString();

    gameStartAndEndDates[i] = startOrEndString + currentDateString;
  }

  return gameStartAndEndDates;
}

function createTurnsPerMatchChart(playedTurnsData) {
  const data = {
    labels: playedTurnsData.played_turns.map(
      (currentDataItem, index) => `Match ${index + 1}`
    ),
    datasets: [
      {
        label: "Number of Turns",
        data: playedTurnsData.played_turns.map(
          (currentDataItem) => currentDataItem.num_of_turns
        ),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        y: {
          ticks: {
            precision: 0,
          },
        },
      },
      pointRadius: 7,
      pointHoverRadius: 8,
      plugins: {
        tooltip: {
          callbacks: {
            beforeBody: function (context) {
              const gameData =
                playedTurnsData.played_turns[context[0].dataIndex];

              const gameStartAndEndDates = getGameStartAndEndDates(gameData);

              return gameStartAndEndDates;
            },
          },
        },
      },
    },
  };

  new Chart(document.getElementById("turns-per-match"), config);
  globals.isChartCreated.turnsPerMatch = true;
}

function tooltipLabelCallback(ctx) {
  const value = ctx.raw;
  const data = ctx.chart.data.datasets[0].data;
  const total = data.reduce((a, b) => a + b, 0);
  const percentage = Math.round((value / total) * 100);
  return `Total percentage (${percentage}%)`;
}

function createJosephAppearancesChart(data) {
  const ctx = document.getElementById("joseph-appearances");

  const chartData = {
    labels: ["Yes", "No"],
    datasets: [
      {
        label: "Did Joseph Appear?",
        data: [data.appeared, data.notAppeared],
        backgroundColor: ["rgba(54, 235, 162, 0.6)", "rgba(235, 54, 54, 0.6)"],
        borderColor: ["rgb(54, 235, 162)", "rgb(235, 54, 54)"],
        borderWidth: 1,
        barThickness: 100,
      },
    ],
  };

  const config = {
    type: "bar",
    data: chartData,
    options: {
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: tooltipLabelCallback,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          title: {
            display: true,
            text: "Games",
          },
        },
      },
    },
  };

  new Chart(ctx, config);
  globals.isChartCreated.josephAppearances = true;
}

function createMinionsKilledChart(minionsKilledPerMatch) {
  const ctx = document.getElementById("minions-killed");

  const labels = ["Total Killed", "Average Minions Killed"];
  const data = [
    minionsKilledPerMatch.total_killed,
    minionsKilledPerMatch.average_killed,
  ];
  for (let i = 0; i < minionsKilledPerMatch.length; i++) {
    labels.push(`Match ${i + 1}`);
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Minions Killed",
        data: data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        barThickness: 110,
      },
    ],
  };

  const config = {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#fff" },
        },
        title: {
          display: true,
          text: "Minions Killed",
          color: "#fff",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#fff", precision: 0 },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    },
  };

  new Chart(ctx, config);
  globals.isChartCreated.minionsKilled = true;
}

function createFumblesPerMatchChart(fumblesData) {
  const ctx = document.getElementById("fumbles-per-match");

  const data = {
    labels: fumblesData.map((currentDataItem, index) => `Match ${index + 1}`),
    datasets: [
      {
        label: "Number of Fumbles",
        data: fumblesData.map(
          (currentDataItem) => currentDataItem.num_of_fumbles
        ),
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {
      scales: {
        y: {
          ticks: {
            precision: 0,
          },
        },
      },
      pointRadius: 7,
      pointHoverRadius: 8,
      plugins: {
        tooltip: {
          callbacks: {
            beforeBody: function (context) {
              const gameData = fumblesData[context[0].dataIndex];

              const gameStartAndEndDates = getGameStartAndEndDates(gameData);

              return gameStartAndEndDates;
            },
          },
        },
      },
    },
  };

  new Chart(ctx, config);
  globals.isChartCreated.fumblesPerMatch = true;
}

function createCriticalHitsPerMatchChart(criticalHitsData) {
  const ctx = document.getElementById("critical-hits-per-match");

  const data = {
    labels: criticalHitsData.map(
      (currentDataItem, index) => `Match ${index + 1}`
    ),
    datasets: [
      {
        label: "Number of Critical Hits",
        data: criticalHitsData.map(
          (currentDataItem) => currentDataItem.num_of_critical_hits
        ),
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {
      scales: {
        y: {
          ticks: {
            precision: 0,
          },
        },
      },
      borderColor: "rgb(255, 255, 0, 0.75)",
      backgroundColor: "rgb(0, 0, 0)",
      pointBorderColor: "rgb(255, 255, 0, 0.75)",
      pointBackgroundColor: "rgb(0, 0, 0)",
      pointRadius: 7,
      pointHoverRadius: 8,
      plugins: {
        tooltip: {
          callbacks: {
            beforeBody: function (context) {
              const gameData = criticalHitsData[context[0].dataIndex];

              const gameStartAndEndDates = getGameStartAndEndDates(gameData);

              return gameStartAndEndDates;
            },
          },
        },
      },
    },
  };

  new Chart(ctx, config);
  globals.isChartCreated.criticalHitsPerMatch = true;
}

function createUsedCardsChart(dataFromServer) {
  const ctx = document.getElementById("used-cards");

  const labels = [
    "Total Used Cards",
    "Used Cards (Last Match)",
    "Average Used Cards",
  ];

  const total = dataFromServer.total_used_cards;
  const avg = dataFromServer.average_used_cards;

  const used =
    dataFromServer.used_cards && dataFromServer.used_cards.length > 0
      ? dataFromServer.used_cards[dataFromServer.used_cards.length - 1]
          .num_of_used_cards
      : 0;
  const data = [total, used, avg];

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  const config = {
    type: "polarArea",
    data: chartData,
    options: {
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
        title: {
          display: true,
          text: "Used Cards",
          color: "#fff",
        },
      },
      scales: {
        r: {
          ticks: {
            color: "#fff",
            precision: 0,
          },
          grid: {
            color: "rgba(255,255,255,0.2)",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            beforeBody: function (context) {
              if (context[0].dataIndex === 1) {
                const gameData =
                  dataFromServer.used_cards[context[0].dataIndex];

                const gameStartAndEndDates = getGameStartAndEndDates(gameData);

                return gameStartAndEndDates;
              }
            },
          },
        },
      },
    },
  };

  new Chart(ctx, config);
  globals.isChartCreated.usedCards = true;
}

function displayChart(chartID) {
  const charts = document.querySelectorAll("#chart-container > canvas");

  for (let i = 0; i < charts.length; i++) {
    const currentChart = charts[i];

    if (chartID === i) {
      currentChart.style.display = "block";
    } else {
      currentChart.style.display = "none";
    }
  }
}

function setNoDataFoundParaContent(content) {
  const noDataFoundPara = document.getElementById("no-data-found");
  noDataFoundPara.textContent = content;
}

async function getWinRate() {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${globals.playersIDs.loggedIn}/won-lost-matches/`;

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();

    setNoDataFoundParaContent(data.message || "");

    if (!data.message) {
      return data;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getTotalPlayedTurns(loggedInPlayerID) {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-played-turns`;
  const response = await fetch(url);

  if (response.ok) {
    const playedTurnsData = await response.json();

    setNoDataFoundParaContent(playedTurnsData.message || "");

    if (!playedTurnsData.message) {
      return playedTurnsData;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getJosephAppearances(loggedInPlayerID) {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/joseph-appeared`;
  const response = await fetch(url);

  if (response.ok) {
    const josephAppearedData = await response.json();

    setNoDataFoundParaContent(josephAppearedData.message || "");

    if (!josephAppearedData.message) {
      return {
        appeared: josephAppearedData.total_joseph_appeared,
        notAppeared: josephAppearedData.total_joseph_not_appeared,
        percentageAppeared: josephAppearedData.percentage_joseph_appeared,
        percentageNotAppeared:
          josephAppearedData.percentage_joseph_not_appeared,
      };
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getMinionsKilled(loggedInPlayerID) {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-minions-killed`;
  const response = await fetch(url);

  if (response.ok) {
    const killedMinions = await response.json();

    setNoDataFoundParaContent(killedMinions.message || "");

    if (!killedMinions.message) {
      return killedMinions;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getFumblesData() {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${globals.playersIDs.loggedIn}/total-fumbles`;

  const response = await fetch(url);

  if (response.ok) {
    const fumblesData = await response.json();

    setNoDataFoundParaContent(fumblesData.message || "");

    if (!fumblesData.message) {
      return fumblesData.fumbles;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getCriticalHitsData() {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${globals.playersIDs.loggedIn}/total-critical-hits`;

  const response = await fetch(url);

  if (response.ok) {
    const criticalHitsData = await response.json();

    setNoDataFoundParaContent(criticalHitsData.message || "");

    if (!criticalHitsData.message) {
      return criticalHitsData.crits;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

async function getUsedCards(loggedInPlayerID) {
  const url = `https://er5-kaotiklash-server.onrender.com/api/player_stats/${loggedInPlayerID}/total-used-cards`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();

    setNoDataFoundParaContent(data.message || "");

    if (!data.message) {
      return data;
    }
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
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

function loadInitialMusic() {
  const taverMusic = document.getElementById("taverMusic");
  const loginAndRegisterSound = document.getElementById("login-register-music");
  const playerSessionMusic = document.getElementById("player-session-music");

  globals.sounds.push(taverMusic, loginAndRegisterSound, playerSessionMusic);

  let initialLoaded = 0;
  const totalInitial = globals.sounds.length;

  for (let i = 0; i < totalInitial.length; i++) {
    const sound = globals.sounds[i];
    sound.addEventListener("timeupdate", updateMusic, false);
    sound.addEventListener("canplaythrough", initialLoadHandler, false);
    sound.load();
  }

  function initialLoadHandler() {
    initialLoaded++;
    if (initialLoaded >= totalInitial) {
      for (let i = 0; i < totalInitial.length; i++) {
        globals.sounds[i].removeEventListener(
          "canplaythrough",
          initialLoadHandler,
          false
        );
      }
    }
  }
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
  await loadDBCardsDataAndAssets();

  // CREATE THE "Game" CLASS INSTANCE USED THROUGHOUT
  const playersNames = getPlayersNames();
  globals.game = await Game.create(playersNames);

  // FIRST FRAME REQUEST
  window.requestAnimationFrame(executeGameLoop);
}

function initVars() {
  const opponentSelect = document.getElementById("opponent-select");
  globals.playersIDs.lastOpponent = opponentSelect.value;

  // INITIALIZE TIME MANAGEMENT VARIABLES
  globals.previousCycleMilliseconds = 0;
  globals.deltaTime = 0;
  globals.frameTimeObj = 1 / FPS;

  // INITIALIZE GAME STATE
  globals.gameState = GameState.LOADING;

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

    loadAssets();

    globals.assetsLoadProgressAsPercentage =
      100 / (globals.assetsToLoad.length + 2);
  } else {
    alert(`Communication error: ${response.statusText}`);
  }
}

function loadAssets() {
  // LOAD BOARD IMAGE
  globals.boardImage = new Image();
  globals.boardImage.addEventListener("load", loadHandler, false);
  globals.boardImage.src = "../images/board.jpg";
  globals.assetsToLoad.push(globals.boardImage);

  // LOAD PHASE BUTTON IMAGE
  globals.phaseButtonImage = new Image();
  globals.phaseButtonImage.addEventListener("load", loadHandler, false);
  globals.phaseButtonImage.src = "../images/phase-button.png";
  globals.assetsToLoad.push(globals.phaseButtonImage);

  // LOAD PHASE MESSAGES BOARD IMAGE
  globals.phaseMsgsBoardImage = new Image();
  globals.phaseMsgsBoardImage.addEventListener("load", loadHandler, false);
  globals.phaseMsgsBoardImage.src = "../images/phase-msgs-board.png";
  globals.assetsToLoad.push(globals.phaseMsgsBoardImage);

  // LOAD ACTIVE EVENTS TABLE IMAGE
  globals.activeEventsTableImage = new Image();
  globals.activeEventsTableImage.addEventListener("load", loadHandler, false);
  globals.activeEventsTableImage.src = "../images/active-events-table.png";
  globals.assetsToLoad.push(globals.activeEventsTableImage);

  // LOAD CARDS IN HAND CONTAINER IMAGE
  globals.cardsInHandContainerImage = new Image();
  globals.cardsInHandContainerImage.addEventListener(
    "load",
    loadHandler,
    false
  );
  globals.cardsInHandContainerImage.src =
    "../images/cards-in-hand-container.png";
  globals.assetsToLoad.push(globals.cardsInHandContainerImage);

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
      name: "josephBig",
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
    {
      name: "josephSmall",
      image_src: "../images/main_characters/templates/version_small_joseph.png",
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

  // LOAD CARDS BALLOONS

  const balloons = [
    {
      name: "mainCharactersBalloon",
      image_src: "../images/main-characters-balloon.png",
    },
    {
      name: "minionsBalloon",
      image_src: "../images/minions-balloon.png",
    },
    {
      name: "josephBalloon",
      image_src: "../images/joseph-balloon.png",
    },
  ];

  createAndStoreImageObjs(balloons, globals.balloonsImages);

  // LOAD SOUNDS

  const bulbBreakingSound = document.getElementById("bulbBreakingSound");
  const punchSound = document.getElementById("punchSound");
  const equipmentSound = document.getElementById("equipmentSound");
  const deathSound = document.getElementById("deathSound");
  const moveSound = document.getElementById("moveSound");
  const talkingSound = document.getElementById("talkingSound");
  const gameMusic = document.getElementById("gameMusic");
  gameMusic.addEventListener("timeupdate", updateMusic, false);
  const josephMusic = document.getElementById("joseph-music");
  josephMusic.addEventListener("timeupdate", updateMusic, false);
  const winnerMusic = document.getElementById("winner-music");
  winnerMusic.addEventListener("timeupdate", updateMusic, false);
  const meleeSound = document.getElementById("meleeSound");
  const missileHybridSound = document.getElementById("missile-hybridSound");

  globals.sounds.push(
    bulbBreakingSound,
    punchSound,
    equipmentSound,
    deathSound,
    moveSound,
    talkingSound,
    gameMusic,
    josephMusic,
    winnerMusic,
    meleeSound,
    missileHybridSound
  );

  for (let i = 0; i < globals.sounds.length; i++) {
    const currentSound = globals.sounds[i];
    currentSound.addEventListener("canplaythrough", loadHandler, false);
    currentSound.load();
    globals.assetsToLoad.push(currentSound);
  }
}

// CODE BLOCK TO CALL EACH TIME AN ASSET IS LOADED
function loadHandler() {
  globals.assetsLoaded++;

  globals.assetsLoadProgressAsPercentage +=
    100 / (globals.assetsToLoad.length + 2);

  if (globals.assetsLoaded === globals.assetsToLoad.length) {
    // REMOVE THE "canplaythrough" EVENT LISTENER FROM SOUNDS
    for (let i = 0; i < globals.sounds.length; i++) {
      const currentSound = globals.sounds[i];
      currentSound.removeEventListener("canplaythrough", loadHandler, false);
    }

    globals.gameState = GameState.PLAYING;
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

function getPlayersNames() {
  const playersNames = {
    loggedIn: "",
    opponent: "",
  };

  playersNames.loggedIn = localStorage.getItem("playerName");

  const opponentSelect = document.getElementById("opponent-select");
  playersNames.opponent =
    opponentSelect.options[opponentSelect.selectedIndex].label;

  return playersNames;
}

function updateMusic() {
  if (globals.currentMusic !== Music.NO_MUSIC) {
    const buffer = 0.28;
    const music = globals.sounds[globals.currentMusic];

    if (music.currentTime > music.duration - buffer) {
      music.currentTime = 0;
      music.play();
    }
  }
}

export function checkIfMusicIsPlayingAndIfSoReset() {
  if (globals.currentMusic !== Music.NO_MUSIC) {
    const music = globals.sounds[globals.currentMusic];
    music.pause();
    music.currentTime = 0;
  }
}

export function setMusic(music) {
  globals.currentMusic = music;
  globals.sounds[globals.currentMusic].play();
  globals.sounds[globals.currentMusic].volume = 0.5;
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
