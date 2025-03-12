import Card from "./Card.js";

export default class CardFactory{

    #cardsData;

    constructor(category, dbEntryID){
        this.category = category;
        this.dbEntryID = dbEntryID;
    }

    createCard(category, dbEntryID){
        const card = new Card(dbEntryID, category);
        return card;
    }
}