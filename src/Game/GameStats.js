import PlayerStats from "./PlayerStats.js";

export default class GameStats {
  #winnerID;
  #date;
  #startTime;
  #durationInMinutes;
  #playedTurns;
  #josephAppeared;
  #playersStats;

  constructor(date, startTime, playersStats) {
    this.#winnerID = -1;
    this.#date = date;
    this.#startTime = startTime;
    this.#durationInMinutes = -1;
    this.#playedTurns = 1;
    this.#josephAppeared = false;
    this.#playersStats = playersStats;
  }

  static create() {
    // CREATION OF GENERAL GAME STATISTICS
    const date = new Date().toISOString().split("T")[0];
    const startTime = Date.now();

    // CREATION OF ARRAY OF OBJECTS FILLED WITH STATISTICS SPECIFIC TO EACH PLAYER
    const player1Stats = new PlayerStats();
    const player2Stats = new PlayerStats();
    const playersStats = [player1Stats, player2Stats];

    const gameStats = new GameStats(date, startTime, playersStats);

    return gameStats;
  }

  incrementPlayerXMinionsKilled(playerID) {
    this.#playersStats[playerID].incrementMinionsKilled();
  }

  incrementPlayerXFumbles(playerID) {
    this.#playersStats[playerID].incrementFumbles();
  }

  incrementPlayerXCriticalHits(playerID) {
    this.#playersStats[playerID].incrementCriticalHits();
  }

  incrementPlayerXUsedCards(playerID) {
    this.#playersStats[playerID].incrementUsedCards();
  }
}
