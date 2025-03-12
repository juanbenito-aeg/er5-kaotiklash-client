export default class Deck{
    
    constructor(deckType){
        this.cards = [];  
        this.deckType = deckType;  
    }

    getCards(){
        return this.cards;
    }

    getDeckType(){
        return this.deckType;
    }
}   