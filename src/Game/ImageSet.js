export default class ImageSet {
  #image;
  #xInit;
  #yInit;
  #xSize;
  #ySize;
  #xDestinationSize;
  #yDestinationSize;

  constructor(
    image,
    xInit,
    yInit,
    xSize,
    ySize,
    xDestinationSize,
    yDestinationSize
  ) {
    this.#image = image;
    this.#xInit = xInit;
    this.#yInit = yInit;
    this.#xSize = xSize;
    this.#ySize = ySize;
    this.#xDestinationSize = xDestinationSize;
    this.#yDestinationSize = yDestinationSize;
  }

  static #initCardsTemplates() {
    // TODO: SPECIFY "src" ATTRIBUTES

    const angeloTemplate = new Image();
    angeloTemplate.src = "";

    const angeloSmallTemplate = new Image();
    angeloSmallTemplate.src = "";

    const lucretiaTemplate = new Image();
    lucretiaTemplate.src = "";

    const lucretiaSmallTemplate = new Image();
    lucretiaSmallTemplate.src = "";

    const xgTemplate = new Image();
    xgTemplate.src = "";

    const xgSmallTemplate = new Image();
    xgSmallTemplate.src = "";

    const throneTemplate = new Image();
    throneTemplate.src = "";

    const throneSmallTemplate = new Image();
    throneSmallTemplate.src = "";

    const josephTemplate = new Image();
    josephTemplate.src = "";

    const josephSmallTemplate = new Image();
    josephSmallTemplate.src = "";

    const warriorsTemplate = new Image();
    warriorsTemplate.src = "";

    const wizardsTemplate = new Image();
    wizardsTemplate.src = "";

    const deerTemplate = new Image();
    deerTemplate.src = "";

    const weaponsTemplate = new Image();
    weaponsTemplate.src = "";

    const armorTemplate = new Image();
    armorTemplate.src = "";

    const specialTemplate = new Image();
    specialTemplate.src = "";

    const rareTemplate = new Image();
    rareTemplate.src = "";

    const generalTemplate = new Image();
    generalTemplate.src = "";

    /* 
    ImageSet.#cardsTemplates = [
      angeloTemplate,
      angeloSmallTemplate,
      lucretiaTemplate,
      lucretiaSmallTemplate,
      xgTemplate,
      xgSmallTemplate,
      throneTemplate,
      throneSmallTemplate,
      josephTemplate,
      josephSmallTemplate,
      warriorsTemplate,
      wizardsTemplate,
      deerTemplate,
      weaponsTemplate,
      armorTemplate,
      specialTemplate,
      rareTemplate,
      generalTemplate,
    ]; */
  }

  static #initCardsIcons() {
    // TODO: SPECIFY "src" ATTRIBUTES

    ImageSet.WizardMinionIcon = new Image();
    ImageSet.WizardMinionIcon.src = "";

    ImageSet.WarriorMinionIcon = new Image();
    ImageSet.WarriorMinionIcon.src = "";

    ImageSet.DeerMinionIcon = new Image();
    ImageSet.DeerMinionIcon.src = "";

    ImageSet.WeaponIcon = new Image();
    ImageSet.WeaponIcon.src = "";

    ImageSet.ArmorIcon = new Image();
    ImageSet.ArmorIcon.src = "";

    ImageSet.SpecialIcon = new Image();
    ImageSet.SpecialIcon.src = "";

    ImageSet.RareIcon = new Image();
    ImageSet.RareIcon.src = "";

    //ImageSet.#cardsTemplates = [];
  }

  static #initCardsReverse() {
    // TODO: SPECIFY "src" ATTRIBUTES
    /*  ImageSet.#cardsReverse = new Image();
    ImageSet.#cardsReverse.src = "";

    ImageSet.#cardsReverseSmall = new Image();
    ImageSet.#cardsReverseSmall.src = ""; */
  }

  static initCommonAssets() {
    ImageSet.#initCardsTemplates();
    ImageSet.#initCardsIcons();
    ImageSet.#initCardsReverse();
  }
}
