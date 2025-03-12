import Card from "./Card.js";

export default class CardFactory {
  #cardsData;

  constructor(cardsData) {
    this.#cardsData = cardsData;
  }

  createCard(cardId) {
    this.#cardsData[cardId];
    const cardData = new Card(cardData.cardId, cardData.category);
    return cardData;
  }
}
