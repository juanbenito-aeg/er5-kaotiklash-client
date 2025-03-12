export default class Card{

    #nameEN;
    #nameBQ;
    #descriptionEn;
    #descriptionBQ;

    constructor(id, category){
        this.id = id;
        this.category = category;
    }

     getID(){}

     getCategory(){}

     getNameEN(){
        return this.#nameEN;
     }

     //getNameBQ(){} *
     
     getDescriptionEN(){
        return this.#descriptionEn;
     }

     //getDescriptionBQ(){} *

     // * Not now

}