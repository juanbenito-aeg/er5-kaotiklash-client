import { GameState, Language } from "./constants.js";

export default {
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
  balloonsImages: [],
  imagesDestinationSizes: {},
  assetsToLoad: [], // HOLDS THE ELEMENTS TO LOAD
  assetsLoaded: 0, // INDICATES THE NUMBER OF ELEMENTS THAT HAVE BEEN LOADED SO FAR
  gameState: GameState.INVALID,
  game: {},
  language: Language.ENGLISH,
  isCurrentTurnFinished: false,
  buttonDataGlobal: [],
  firstActivePlayerID: -1, // (!) DELETE AFTER IMPLEMENTING CHANGE OF PLAYERS PERSPECTIVE
  phaseMessage: {},
  isScreenInitialized: {
    register: false,
    playerSessionScreen: false,
    stats: false,
  },
  playersIDs: {
    loggedIn: -1,
    lastOpponent: -1,
  },
  isChartCreated: {
    winRate: false,
    turnsPerMatch: false,
    josephAppearances: false,
    minionsKilled: false,
    fumblesPerMatch: false,
    criticalHitsPerMatch: false,
    usedCardsPerMatch: false,
  },
};
