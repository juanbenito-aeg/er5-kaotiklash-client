import Box from "./Box.js";
import Grid from "./Grid.js";
import Board from "./Board.js";
import { BoxState, GridType, BattlefieldArea } from "../Game/constants.js";

export default class GridCreator {
  createAllGrids() {
    // CREATION OF GRIDS THAT ARE NOT RELATED TO ANY PARTICULAR PLAYER

    // EVENTS DECK GRID
    const eventsDeckBox = new Box(
      1790,
      615,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const eventsDeckGrid = new Grid(GridType.EVENTS_DECK, [eventsDeckBox]);

    // ACTIVE EVENTS GRID
    const activeEventsBox = new Box(
      1790,
      235,
      565,
      355,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const activeEventsGrid = new Grid(GridType.ACTIVE_EVENTS_TABLE, [
      activeEventsBox,
    ]);

    // PHASE BUTTONS GRID
    const phaseButtonsBoxes = [];
    let phaseButtonBoxYCoordinate = 728;
    for (let i = 0; i < 5; i++) {
      const currentPhaseButtonsBox = new Box(
        400,
        phaseButtonBoxYCoordinate,
        200,
        50,
        false,
        false,
        BoxState.INACTIVE,
        BattlefieldArea.NONE
      );

      phaseButtonsBoxes.push(currentPhaseButtonsBox);

      phaseButtonBoxYCoordinate += 50;
    }
    const phaseButtonsGrid = new Grid(
      GridType.PHASE_BUTTONS,
      phaseButtonsBoxes
    );

    // JOSEPH (CARD) GRID
    const josephBox = new Box(
      400,
      365,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const josephGrid = new Grid(GridType.JOSEPH, [josephBox]);

    // MESSAGES GRID
    const messagesBox = new Box(
      1790,
      25,
      565,
      185,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const messagesGrid = new Grid(GridType.MESSAGES, [messagesBox]);

    // CREATION OF GRIDS RELATED TO PLAYER 1

    // PLAYER 1 MAIN CHARACTER BOX AND GRID
    const player1MainCharacterBox = new Box(
      2015,
      840,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const player1MainCharacterGrid = new Grid(
      GridType.PLAYER_1_MAIN_CHARACTER,
      [player1MainCharacterBox]
    );

    // PLAYER 1 MINIONS DECK BOX AND GRID
    const player1MinionsDeckBox = new Box(
      1790,
      840,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const player1MinionsDeckGrid = new Grid(GridType.PLAYER_1_MINIONS_DECK, [
      player1MinionsDeckBox,
    ]);

    // PLAYER 1 CARDS IN HAND BOXES AND GRID
    const player1CardsInHandBoxes = [];
    let player1CardsInHandBoxXCoordinate = 803;
    for (let i = 0; i < 6; i++) {
      const player1CardsInHandBox = new Box(
        player1CardsInHandBoxXCoordinate,
        985,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        BattlefieldArea.NONE
      );

      player1CardsInHandBoxes.push(player1CardsInHandBox);

      player1CardsInHandBoxXCoordinate += 135;
    }
    const player1CardsInHandGrid = new Grid(
      GridType.PLAYER_1_CARDS_IN_HAND,
      player1CardsInHandBoxes
    );

    // PLAYER 1 BATTLEFIELD BOXES AND GRID
    const player1BattlefieldBoxes = [];
    let player1BattlefieldBoxXCoordinate = 600;
    let player1BattlefieldBoxYCoordinate = 843;
    for (let i = 0; i < 18; i++) {
      player1BattlefieldBoxXCoordinate += 135;

      let battlefieldArea;

      if (i < 6) {
        battlefieldArea = BattlefieldArea.REAR;
      } else if (i < 12) {
        if (i === 6) {
          player1BattlefieldBoxXCoordinate = 735;
          player1BattlefieldBoxYCoordinate = 707;
        }

        battlefieldArea = BattlefieldArea.MIDDLE;
      } else {
        if (i === 12) {
          player1BattlefieldBoxXCoordinate = 735;
          player1BattlefieldBoxYCoordinate = 573;
        }

        battlefieldArea = BattlefieldArea.FRONT;
      }

      const player1BattlefieldBox = new Box(
        player1BattlefieldBoxXCoordinate,
        player1BattlefieldBoxYCoordinate,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        battlefieldArea
      );

      player1BattlefieldBoxes.push(player1BattlefieldBox);
    }
    const player1BattlefieldGrid = new Grid(
      GridType.PLAYER_1_BATTLEFIELD,
      player1BattlefieldBoxes
    );

    // PLAYER 1 PREPARE EVENT BOXES AND GRID
    const prepareEventBoxes = [];
    let prepareEventBoxYCoordinate = 842;
    for (let i = 0; i < 3; i++) {
      const prepareEventBox = new Box(
        1545,
        prepareEventBoxYCoordinate,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        BattlefieldArea.NONE
      );

      prepareEventBoxes.push(prepareEventBox);

      prepareEventBoxYCoordinate -= 135;
    }
    const player1PrepareEventGrid = new Grid(
      GridType.PLAYER_1_PREPARE_EVENT,
      prepareEventBoxes
    );

    // CREATION OF GRIDS RELATED TO PLAYER 2

    // PLAYER 2 MAIN CHARACTER BOX AND GRID
    const player2MainCharacterBox = new Box(
      175,
      25,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const player2MainCharacterGrid = new Grid(
      GridType.PLAYER_2_MAIN_CHARACTER,
      [player2MainCharacterBox]
    );

    // PLAYER 2 MINION DECK BOX AND GRID
    const player2MinionsDeckBox = new Box(
      400,
      25,
      200,
      200,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const player2MinionsDeckGrid = new Grid(GridType.PLAYER_2_MINIONS_DECK, [
      player2MinionsDeckBox,
    ]);

    // PLAYER 2 CARDS IN HANDS BOXES AND GRID
    const player2CardsInHandBoxes = [];
    // THE PLAYER 2 CARDS IN HAND GRID NOW CREATES FROM RIGHT TO LEFT, INSTEAD OF LEFT TO RIGHT
    let player2CardsInHandBoxXCoordinate = 1475;
    for (let i = 0; i < 6; i++) {
      const player2CardsInHandBox = new Box(
        player2CardsInHandBoxXCoordinate,
        25,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        BattlefieldArea.NONE
      );

      player2CardsInHandBoxes.push(player2CardsInHandBox);

      player2CardsInHandBoxXCoordinate -= 135;
    }
    const player2CardsInHandGrid = new Grid(
      GridType.PLAYER_2_CARDS_IN_HAND,
      player2CardsInHandBoxes
    );

    // PLAYER 2 BATTLEFIELD BOXES
    const player2BattlefieldBoxes = [];
    let player2BattlefieldBoxXCoordinate = 1680;
    let player2BattlefieldBoxYCoordinate = 168;
    for (let i = 0; i < 18; i++) {
      player2BattlefieldBoxXCoordinate -= 135;

      let battlefieldArea;

      if (i < 6) {
        battlefieldArea = BattlefieldArea.REAR;
      } else if (i < 12) {
        if (i === 6) {
          player2BattlefieldBoxXCoordinate = 1545;
          player2BattlefieldBoxYCoordinate = 303;
        }

        battlefieldArea = BattlefieldArea.MIDDLE;
      } else {
        if (i === 12) {
          player2BattlefieldBoxXCoordinate = 1545;
          player2BattlefieldBoxYCoordinate = 438;
        }

        battlefieldArea = BattlefieldArea.FRONT;
      }

      const player2BattlefieldBox = new Box(
        player2BattlefieldBoxXCoordinate,
        player2BattlefieldBoxYCoordinate,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        battlefieldArea
      );

      player2BattlefieldBoxes.push(player2BattlefieldBox);
    }
    const player2BattlefieldGrid = new Grid(
      GridType.PLAYER_2_BATTLEFIELD,
      player2BattlefieldBoxes
    );

    // PLAYER 2 PREPARE EVENT BOXES AND GRID
    const player2PrepareEventBoxes = [];
    let player2PrepareEventBoxYCoordinate = 168;
    for (let i = 0; i < 3; i++) {
      const player2PrepareEventBox = new Box(
        735,
        player2PrepareEventBoxYCoordinate,
        110,
        110,
        false,
        false,
        BoxState.AVAILABLE,
        BattlefieldArea.NONE
      );

      player2PrepareEventBoxes.push(player2PrepareEventBox);

      player2PrepareEventBoxYCoordinate += 135;
    }
    const player2PrepareEventGrid = new Grid(
      GridType.PLAYER_2_PREPARE_EVENT,
      player2PrepareEventBoxes
    );

    const board = new Board([
      eventsDeckGrid,
      activeEventsGrid,
      josephGrid,
      messagesGrid,
      phaseButtonsGrid,
      player1MainCharacterGrid,
      player1MinionsDeckGrid,
      player1CardsInHandGrid,
      player1BattlefieldGrid,
      player1PrepareEventGrid,
      player2MainCharacterGrid,
      player2MinionsDeckGrid,
      player2CardsInHandGrid,
      player2BattlefieldGrid,
      player2PrepareEventGrid,
    ]);
    return board;
  }
}
