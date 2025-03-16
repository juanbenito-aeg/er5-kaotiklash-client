import Box from "./Box.js";
import Grid from "./Grid.js";
import Board from "./Board.js";
import { BoxState, GridType, BattlefieldArea } from "../Game/constants.js";

export default class GridCreator {
  createAllGrids() {
    // CREATION OF GRIDS THAT ARE NOT RELATED TO ANY PARTICULAR PLAYER

    // EVENTS DECK GRID
    const eventsDeckBox = new Box(
      0,
      0,
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
      0,
      0,
      400,
      400,
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
    let phaseButtonBoxYCoordinate = 200;
    for (let i = 0; i < 5; i++) {
      const currentPhaseButtonsBox = new Box(
        200,
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
      0,
      85,
      40,
      90,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const josephGrid = new Grid(GridType.JOSEPH, [josephBox]);

    // MESSAGES GRID
    const messagesBox = new Box(
      0,
      210,
      85,
      95,
      false,
      false,
      BoxState.INACTIVE,
      BattlefieldArea.NONE
    );
    const messagesGrid = new Grid(GridType.MESSAGES, [messagesBox]);

    // CREATION OF GRIDS RELATED TO PLAYER 1

    // PLAYER 1 MAIN CHARACTER BOX AND GRID
    const player1MainCharacterBox = new Box(
      0,
      0,
      50,
      50,
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
      0,
      20,
      50,
      50,
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
    let player1CardsInHandBoxXCoordinate = 120;
    for (let i = 0; i < 6; i++) {
      const player1CardsInHandBox = new Box(
        player1CardsInHandBoxXCoordinate,
        200,
        100,
        70,
        false,
        false,
        BoxState.AVAILABLE,
        BattlefieldArea.NONE
      );

      player1CardsInHandBoxes.push(player1CardsInHandBox);

      player1CardsInHandBoxXCoordinate += 10;
    }
    const player1CardsInHandGrid = new Grid(
      GridType.PLAYER_1_CARDS_IN_HAND,
      player1CardsInHandBoxes
    );

    // PLAYER 1 BATTLEFIELD BOXES AND GRID
    const player1BattlefieldBoxes = [];
    let player1BattlefieldBoxXCoordinate = 225;
    let player1BattlefieldBoxYCoordinate = 250;
    for (let i = 0; i < 18; i++) {
      player1BattlefieldBoxXCoordinate += 25;

      let battlefieldArea;

      if (i < 6) {
        battlefieldArea = BattlefieldArea.FRONT;
      } else if (i < 12) {
        if (i === 6) {
          player1BattlefieldBoxXCoordinate = 225;
          player1BattlefieldBoxYCoordinate += 25;
        }

        battlefieldArea = BattlefieldArea.MIDDLE;
      } else {
        if (i === 12) {
          player1BattlefieldBoxXCoordinate = 225;
          player1BattlefieldBoxYCoordinate += 25;
        }

        battlefieldArea = BattlefieldArea.REAR;
      }

      const player1BattlefieldBox = new Box(
        player1BattlefieldBoxXCoordinate,
        player1BattlefieldBoxYCoordinate,
        50,
        70,
        false,
        false,
        BoxState.INACTIVE,
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
    let prepareEventBoxYCoordinate = 100;
    for (let i = 0; i < 3; i++) {
      const prepareEventBox = new Box(
        130,
        prepareEventBoxYCoordinate,
        50,
        85,
        false,
        false,
        BoxState.INACTIVE,
        BattlefieldArea.NONE
      );

      prepareEventBoxes.push(prepareEventBox);

      prepareEventBoxYCoordinate += 5;
    }
    const player1PrepareEventGrid = new Grid(
      GridType.PLAYER_1_PREPARE_EVENT,
      prepareEventBoxes
    );

    // CREATION OF GRIDS RELATED TO PLAYER 2

    // PLAYER 2 MAIN CHARACTER BOX AND GRID
    const player2MainCharacterBox = new Box(
      110,
      200,
      50,
      70,
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
      5,
      0,
      200,
      70,
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
    let player2CardsInHandBoxXCoordinate = 120;
    for (let i = 0; i < 6; i++) {
      const player2CardsInHandBox = new Box(
        player2CardsInHandBoxXCoordinate,
        200,
        100,
        70,
        false,
        false,
        BoxState.INACTIVE,
        BattlefieldArea.NONE
      );

      player2CardsInHandBoxes.push(player2CardsInHandBox);

      player2CardsInHandBoxXCoordinate += 10;
    }
    const player2CardsInHandGrid = new Grid(
      GridType.PLAYER_2_CARDS_IN_HAND,
      player2CardsInHandBoxes
    );

    // PLAYER 2 BATTLEFIELD BOXES
    const player2BattlefieldBoxes = [];
    let player2BattlefieldBoxXCoordinate = 225;
    let player2BattlefieldBoxYCoordinate = 250;
    for (let i = 0; i < 18; i++) {
      player2BattlefieldBoxXCoordinate += 25;

      let battlefieldArea;

      if (i < 6) {
        battlefieldArea = BattlefieldArea.FRONT;
      } else if (i < 12) {
        if (i === 6) {
          player2BattlefieldBoxXCoordinate = 225;
          player2BattlefieldBoxYCoordinate += 25;
        }

        battlefieldArea = BattlefieldArea.MIDDLE;
      } else {
        if (i === 12) {
          player2BattlefieldBoxXCoordinate = 225;
          player2BattlefieldBoxYCoordinate += 25;
        }

        battlefieldArea = BattlefieldArea.REAR;
      }

      const player2BattlefieldBox = new Box(
        player2BattlefieldBoxXCoordinate,
        player2BattlefieldBoxYCoordinate,
        50,
        70,
        false,
        false,
        BoxState.INACTIVE,
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
    let player2PrepareEventBoxYCoordinate = 100;
    for (let i = 0; i < 3; i++) {
      const player2PrepareEventBox = new Box(
        130,
        player2PrepareEventBoxYCoordinate,
        50,
        85,
        false,
        false,
        BoxState.INACTIVE,
        BattlefieldArea.NONE
      );

      player2PrepareEventBoxes.push(player2PrepareEventBox);

      player2PrepareEventBoxYCoordinate += 5;
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
