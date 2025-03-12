export default class Card{

    constructor(id, type, nameEN, nameBQ, descriptionEN, descriptionBQ){

        this.id = id;
        this.type = type;
        this.nameEN = nameEN;                   //Name in English
        this.nameBQ = nameBQ;                   //Name in Basque
        this.descriptionEN = descriptionEN;     //Description in English
        this.descriptionBQ = descriptionBQ;     //Description in Basque

    }

     getID(){}

     getNameEN(){}

     //getNameBQ(){} *
     
     getDescriptionEN(){}

     //getDescriptionBQ(){} *

     // * Not now

}