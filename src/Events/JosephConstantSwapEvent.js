import Event from "./Event.js";
import PrepareEvent from "./PrepareEvent.js";
import Card from "../Decks/Card.js";
import StateMessage from "../Messages/StateMessage.js";
import globals from "../Game/globals.js";
import { DeckType, GridType, PlayerID } from "../Game/constants.js";

export default class JosephConstantSwapEvent extends Event {
  #events;
  #josephDeck;
  #player1MinionsInPlayDeck;
  #player1EventsInPrepDeck;
  #player1BattlefieldGrid;
  #player1EventsInPrepGrid;
  #player2MinionsInPlayDeck;
  #player2EventsInPrepDeck;
  #player2BattlefieldGrid;
  #player2EventsInPrepGrid;
  #stateMessages;

  constructor(
    executedBy,
    eventCard,
    events,
    josephDeck,
    player1MinionsInPlayDeck,
    player1EventsInPrepDeck,
    player1BattlefieldGrid,
    player1EventsInPrepGrid,
    player2MinionsInPlayDeck,
    player2EventsInPrepDeck,
    player2BattlefieldGrid,
    player2EventsInPrepGrid,
    stateMessages
  ) {
    super(executedBy, eventCard);

    this.#events = events;
    this.#josephDeck = josephDeck;
    this.#player1MinionsInPlayDeck = player1MinionsInPlayDeck;
    this.#player1EventsInPrepDeck = player1EventsInPrepDeck;
    this.#player1BattlefieldGrid = player1BattlefieldGrid;
    this.#player1EventsInPrepGrid = player1EventsInPrepGrid;
    this.#player2MinionsInPlayDeck = player2MinionsInPlayDeck;
    this.#player2EventsInPrepDeck = player2EventsInPrepDeck;
    this.#player2BattlefieldGrid = player2BattlefieldGrid;
    this.#player2EventsInPrepGrid = player2EventsInPrepGrid;
    this.#stateMessages = stateMessages;
  }

  static create(
    executedBy,
    josephDeck,
    deckContainer,
    board,
    events,
    stateMessages
  ) {
    // DECKS VARIABLES
    let player1MinionsInPlayDeck =
      deckContainer.getDecks()[DeckType.PLAYER_1_MINIONS_IN_PLAY];
    let player1EventsInPrepDeck =
      deckContainer.getDecks()[DeckType.PLAYER_1_EVENTS_IN_PREPARATION];
    let player2MinionsInPlayDeck =
      deckContainer.getDecks()[DeckType.PLAYER_2_MINIONS_IN_PLAY];
    let player2EventsInPrepDeck =
      deckContainer.getDecks()[DeckType.PLAYER_2_EVENTS_IN_PREPARATION];

    // GRIDS VARIABLES
    let player1BattlefieldGrid =
      board.getGrids()[GridType.PLAYER_1_BATTLEFIELD];
    let player1EventsInPrepGrid =
      board.getGrids()[GridType.PLAYER_1_PREPARE_EVENT];
    let player2BattlefieldGrid =
      board.getGrids()[GridType.PLAYER_2_BATTLEFIELD];
    let player2EventsInPrepGrid =
      board.getGrids()[GridType.PLAYER_2_PREPARE_EVENT];

    const josephConstantSwapEvent = new JosephConstantSwapEvent(
      executedBy,
      josephDeck.getCards()[0],
      events,
      josephDeck,
      player1MinionsInPlayDeck,
      player1EventsInPrepDeck,
      player1BattlefieldGrid,
      player1EventsInPrepGrid,
      player2MinionsInPlayDeck,
      player2EventsInPrepDeck,
      player2BattlefieldGrid,
      player2EventsInPrepGrid,
      stateMessages
    );

    return josephConstantSwapEvent;
  }

  execute(currentPlayer, enemy) {
    this.#removeAllPrepareEvents();

    const currentDurationInRounds =
      this._eventCard.getCurrentDurationInRounds();

    this.reduceDuration(currentPlayer);

    if (
      this._eventCard.getCurrentDurationInRounds() < currentDurationInRounds
    ) {
      this.#swapCardsBetweenPlayers();

      if (!this.isActive()) {
        this.#createRemovedPrepareEvents(currentPlayer, enemy);

        this.#josephDeck.removeCard(this._eventCard);

        const josephIsGoneMsg = new StateMessage(
          "JOSEPH IS GONE, BUT HE WILL REMAIN IN YOUR NIGHTMARES...",
          "30px MedievalSharp",
          "rgb(225 213 231)",
          3,
          globals.canvas.width / 2,
          globals.canvas.height / 2
        );
        this.#stateMessages.push(josephIsGoneMsg);
      } else {
        const josephExchangedCardsMsg = new StateMessage(
          "JOSEPH EXCHANGED ALL CARDS IN THE COMBAT ARENA BETWEEN PLAYERS!",
          "26px MedievalSharp",
          "rgb(225 213 231)",
          3,
          globals.canvas.width / 2,
          globals.canvas.height / 2
        );
        this.#stateMessages.push(josephExchangedCardsMsg);
      }
    }
  }

  #removeAllPrepareEvents() {
    for (let i = 0; i < this.#events.length; i++) {
      const currentEvent = this.#events[i];

      if (currentEvent instanceof PrepareEvent) {
        this.#events.splice(i, 1);
      }
    }
  }

  #swapCardsBetweenPlayers() {
    // SWAP MINIONS IN PLAY
    this.#swapCardsOfXDecks(
      this.#player1MinionsInPlayDeck,
      this.#player2MinionsInPlayDeck,
      this.#player1BattlefieldGrid,
      this.#player2BattlefieldGrid
    );

    // SWAP EVENTS IN PREPARATION
    this.#swapCardsOfXDecks(
      this.#player1EventsInPrepDeck,
      this.#player2EventsInPrepDeck,
      this.#player1EventsInPrepGrid,
      this.#player2EventsInPrepGrid
    );
  }

  #swapCardsOfXDecks(player1XDeck, player2XDeck, player1XGrid, player2XGrid) {
    for (let i = 0; i < player1XGrid.getBoxes().length; i++) {
      const player1XGridBox = player1XGrid.getBoxes()[i];
      const player2XGridBox = player2XGrid.getBoxes()[i];

      let player1XGridBoxCard;
      let player2XGridBoxCard;

      if (player1XGridBox.isOccupied()) {
        player1XGridBoxCard = player1XGridBox.getCard();
        player1XGridBox.resetCard();

        this.#moveCardFromOneDeckToAnother(
          player1XGridBoxCard,
          player1XDeck,
          player2XDeck
        );
      }
      if (player2XGridBox.isOccupied()) {
        player2XGridBoxCard = player2XGridBox.getCard();
        player2XGridBox.resetCard();

        this.#moveCardFromOneDeckToAnother(
          player2XGridBoxCard,
          player1XDeck,
          player2XDeck
        );
      }

      if (player1XGridBoxCard) {
        player2XGridBox.setCard(player1XGridBoxCard);

        player1XGridBoxCard.setXCoordinate(player2XGridBox.getXCoordinate());
        player1XGridBoxCard.setYCoordinate(player2XGridBox.getYCoordinate());
      }
      if (player2XGridBoxCard) {
        player1XGridBox.setCard(player2XGridBoxCard);

        player2XGridBoxCard.setXCoordinate(player1XGridBox.getXCoordinate());
        player2XGridBoxCard.setYCoordinate(player1XGridBox.getYCoordinate());
      }
    }
  }

  #moveCardFromOneDeckToAnother(cardToMove, deck1, deck2) {
    if (Card.isCardWithinDeck(cardToMove, deck1)) {
      deck1.removeCard(cardToMove);
      deck2.insertCard(cardToMove);
    } else {
      deck2.removeCard(cardToMove);
      deck1.insertCard(cardToMove);
    }
  }

  #createRemovedPrepareEvents(currentPlayer, enemy) {
    const playersEventsInPrepDecks = [
      this.#player1EventsInPrepDeck,
      this.#player2EventsInPrepDeck,
    ];

    for (let i = 0; i < playersEventsInPrepDecks.length; i++) {
      const currentEventsInPrepDeck = playersEventsInPrepDecks[i];

      let ownerOfEventsInPrep;

      if (currentEventsInPrepDeck === this.#player1EventsInPrepDeck) {
        if (currentPlayer.getID() === PlayerID.PLAYER_1) {
          ownerOfEventsInPrep = currentPlayer;
        } else {
          ownerOfEventsInPrep = enemy;
        }
      } else {
        if (currentPlayer.getID() === PlayerID.PLAYER_2) {
          ownerOfEventsInPrep = currentPlayer;
        } else {
          ownerOfEventsInPrep = enemy;
        }
      }

      for (let j = 0; j < currentEventsInPrepDeck.getCards().length; j++) {
        const currentEventInPrep = currentEventsInPrepDeck.getCards()[j];

        const prepareEvent = PrepareEvent.create(
          ownerOfEventsInPrep,
          currentEventInPrep
        );
        this.#events.push(prepareEvent);
      }
    }
  }
}
