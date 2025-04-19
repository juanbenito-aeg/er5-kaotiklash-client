export default class Event {
  _executedBy;
  _lastPlayer;
  _eventCard;

  constructor(executedBy, eventCard) {
    this._executedBy = this._lastPlayer = executedBy;
    this._eventCard = eventCard;
  }

  static create() {}

  execute() {}

  getExecutor() {
    return this._executedBy;
  }

  getEventCard() {
    return this._eventCard;
  }

  reduceDuration(currentPlayer) {
    if (currentPlayer !== this._lastPlayer) {
      this._lastPlayer = currentPlayer;

      if (currentPlayer === this._executedBy) {
        this._eventCard.setCurrentDurationInRounds(
          this._eventCard.getCurrentDurationInRounds() - 1
        );
      }
    }
  }

  isActive() {
    if (this._eventCard.getCurrentDurationInRounds() > 0) {
      return true;
    } else {
      return false;
    }
  }
}
