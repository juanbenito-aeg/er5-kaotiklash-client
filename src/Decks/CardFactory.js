import MainCharacter from "./MainCharacter.js";
import Joseph from "./Joseph.js";
import Minion from "./Minion.js";
import Weapon from "./Weapon.js";
import Armor from "./Armor.js";
import Special from "./Special.js";
import Rare from "./Rare.js";
import { globals } from "../index.js";
import { Language, MainCharacterID } from "../Game/constants.js";

export default class CardFactory {
  #cardsData;

  constructor(cardsData) {
    this.#cardsData = cardsData;
  }

  #createMainCharacter(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardSpecialSkill = rawCard.special_skill_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardSpecialSkill = rawCard.special_skill_eus;
    }

    const processedCard = new MainCharacter(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardSpecialSkill
    );

    return processedCard;
  }

  #createJoseph(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;

    // SELECTION OF RANDOM CHAOTIC EVENT

    const chaoticEventID = Math.floor(Math.random() * 4);
    const gottenChaoticEvent =
      this.#cardsData.joseph_chaotic_events[chaoticEventID];
    let chaoticEventName = gottenChaoticEvent.name_eng;
    let chaoticEventDescription = gottenChaoticEvent.description_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      chaoticEventName = gottenChaoticEvent.name_eus;
      chaoticEventDescription = gottenChaoticEvent.description_eus;
    }

    const processedCard = new Joseph(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      chaoticEventID,
      chaoticEventName,
      chaoticEventDescription
    );

    return processedCard;
  }

  #createMinion(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardCategory = rawCard.category_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardCategory = rawCard.category_eus;
    }

    const processedCard = new Minion(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardCategory,
      rawCard.hp,
      rawCard.madness,
      rawCard.strength,
      rawCard.attack,
      rawCard.constitution,
      rawCard.defense
    );

    return processedCard;
  }

  #createWeapon(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardType = rawCard.type_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardType = rawCard.type_eus;
    }

    const processedCard = new Weapon(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardType,
      rawCard.damage,
      rawCard.durability,
      rawCard.prep_time_in_rounds
    );

    return processedCard;
  }

  #createArmor(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardType = rawCard.type_eng;
    let rawCardSpecialEffect = rawCard.special_effect_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardType = rawCard.type_eus;
      rawCardSpecialEffect = rawCard.special_effect_eus;
    }

    const processedCard = new Armor(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardType,
      rawCardSpecialEffect,
      rawCard.durability,
      rawCard.prep_time_in_rounds
    );

    return processedCard;
  }

  #createSpecial(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardEffect = rawCard.effect_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardEffect = rawCard.effect_eus;
    }

    const processedCard = new Special(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardEffect,
      rawCard.duration_in_rounds,
      rawCard.prep_time_in_rounds
    );

    return processedCard;
  }

  #createRare(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardEffect = rawCard.effect_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardEffect = rawCard.effect_eus;
    }

    const processedCard = new Rare(
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCardEffect,
      rawCard.duration_in_rounds
    );

    return processedCard;
  }

  createCard(cardID, cardCategory) {
    let rawCard;
    let processedCard;

    switch (cardCategory) {
      case "main_characters":
        rawCard = this.#cardsData.main_characters[cardID];
        if (cardID !== MainCharacterID.JOSEPH) {
          processedCard = this.#createMainCharacter(rawCard);
        } else {
          processedCard = this.#createJoseph(rawCard);
        }
        break;

      case "minions":
        rawCard = this.#cardsData.minions[cardID];
        processedCard = this.#createMinion(rawCard);
        break;

      case "weapons":
        rawCard = this.#cardsData.weapons[cardID];
        processedCard = this.#createWeapon(rawCard);
        break;

      case "armor":
        rawCard = this.#cardsData.armor[cardID];
        processedCard = this.#createArmor(rawCard);
        break;

      case "special":
        rawCard = this.#cardsData.special[cardID];
        processedCard = this.#createSpecial(rawCard);
        break;

      case "rare":
        rawCard = this.#cardsData.rare[cardID];
        processedCard = this.#createRare(rawCard);
        break;
    }

    return processedCard;
  }
}
