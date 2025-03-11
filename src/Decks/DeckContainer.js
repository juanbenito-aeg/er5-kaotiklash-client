import Deck from "./Deck.js";

export default class DeckContainer{

    getDecks(){
        const decks = new Deck();
        decks.getDeck();
        return decks;
    }
}