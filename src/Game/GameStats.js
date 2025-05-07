import PlayerStats from "./PlayerStats.js";
import globals from "./globals.js";
import { PlayerID } from "./constants.js";

export default class GameStats {
  #date;
  #startTime;
  #playedTurns;
  #josephAppeared;
  #playersStats;
  #statsAlreadySent;

  constructor(date, startTime, playersStats) {
    this.#date = date;
    this.#startTime = startTime;
    this.#playedTurns = 1;
    this.#josephAppeared = false;
    this.#playersStats = playersStats;
    this.#statsAlreadySent = false;
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

  incrementPlayedTurns() {
    this.#playedTurns++;
  }

  setJosephAppearedToTrue() {
    this.#josephAppeared = true;
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

  async postToDB(winner) {
    let winnerID;
    if (winner.getID() === PlayerID.PLAYER_1) {
      winnerID = globals.playersIDs.loggedIn;
    } else if (winner.getID() === PlayerID.PLAYER_2) {
      winnerID = globals.playersIDs.lastOpponent;
    }

    const durationInMilliseconds = Date.now() - this.#startTime;
    const durationInMinutes = Math.floor(durationInMilliseconds / 60000);

    const url = "https://er5-kaotiklash-server.onrender.com/api/player_stats";

    const player1Stats = this.#playersStats[PlayerID.PLAYER_1];
    const player2Stats = this.#playersStats[PlayerID.PLAYER_2];

    const body = JSON.stringify({
      player_1: globals.playersIDs.loggedIn,
      player_2: globals.playersIDs.lastOpponent,
      winner: winnerID,
      date: this.#date,
      duration_in_minutes: durationInMinutes,
      played_rounds: this.#playedTurns,
      joseph_appeared: this.#josephAppeared,
      player_1_minions_killed: player1Stats.getMinionsKilled(),
      player_2_minions_killed: player2Stats.getMinionsKilled(),
      player_1_fumbles: player1Stats.getFumbles(),
      player_2_fumbles: player2Stats.getFumbles(),
      player_1_critical_hits: player1Stats.getCriticalHits(),
      player_2_critical_hits: player2Stats.getCriticalHits(),
      player_1_used_cards: player1Stats.getUsedCards(),
      player_2_used_cards: player2Stats.getUsedCards(),
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (response.ok) {
      console.log("Game stats saved successfully");
    } else {
      console.error("Error saving game stats:", response.statusText);
    }
  }

  areStatsAlreadySent() {
    return this.#statsAlreadySent;
  }

  setStatsAlreadySentToTrue() {
    this.#statsAlreadySent = true;
  }
}
