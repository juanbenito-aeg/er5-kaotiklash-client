export default class ImageSet {
  static #cardsTemplates;
  static #cardsIcons;
  static #cardsReverse;
  
  #cardImage;
  #xInit;
  #yInit;
  #xSize;
  #ySize;
  #xDestinationSize;
  #yDestinationSize;
  
  constructor(cardImage, xInit, yInit, xSize, ySize, xDestinationSize, yDestinationSize) {
    this.#cardImage = cardImage;
    this.#xInit = xInit;
    this.#yInit = yInit;
    this.#xSize = xSize;
    this.#ySize = ySize;
    this.#xDestinationSize = xDestinationSize;
    this.#yDestinationSize = yDestinationSize;
  }

  static #initCardsTemplates() {
    // TODO: SPECIFY "src" ATTRIBUTES

    const mainCharactersTemplate = new Image();
    mainCharactersTemplate.src = "";
    
    const warriorsTemplate = new Image();
    warriorsTemplate.src = "";
    
    const wizardsTemplate = new Image();
    wizardsTemplate.src = "";
    
    const weaponsTemplate = new Image();
    weaponsTemplate.src = "";
    
    const armorTemplate = new Image();
    armorTemplate.src = "";
    
    const specialTemplate = new Image();
    specialTemplate.src = "";
    
    const rareTemplate = new Image();
    rareTemplate.src = "";

    ImageSet.#cardsTemplates = [
      mainCharactersTemplate,
      warriorsTemplate,
      wizardsTemplate,
      weaponsTemplate,
      armorTemplate,
      specialTemplate,
      rareTemplate,
    ];
  }

  static #initCardsIcons() {
    // TODO
  }

  static #initCardsReverse() {
    // TODO: SPECIFY "src" ATTRIBUTE
    ImageSet.#cardsReverse = new Image();
    ImageSet.#cardsReverse.src = "";
  }

  static initCommonAssets() {
    ImageSet.#initCardsTemplates();
    ImageSet.#initCardsIcons();
    ImageSet.#initCardsReverse();
  }
}