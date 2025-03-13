export default class CardFactory {
  #cardsData;

  constructor(cardsData) {
    this.#cardsData = cardsData;
  }

  createCard(cardID, cardCategory) {
    switch (cardCategory) {
      case "main_characters":
        let card = this.#cardsData.main_characters[cardID];        
        break;
    }
  }
}