import MainCharacter from "./MainCharacter.js";
import Joseph from "./Joseph.js";
import Minion from "./Minion.js";
import Weapon from "./Weapon.js";
import Armor from "./Armor.js";
import Special from "./Special.js";
import Rare from "./Rare.js";
import Text from "../Game/Text.js";
import globals from "../Game/globals.js";
import { Language, CardCategory, MainCharacterID } from "../Game/constants.js";

export default class CardFactory {
  #createMainCharacter(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardSpecialSkill = rawCard.special_skill_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardSpecialSkill = rawCard.special_skill_eus;
    }

    rawCardDescription = Text.create(rawCardDescription, 10, 100, 100);
    console.log(rawCardDescription);

    const processedCard = new MainCharacter(
      CardCategory.MAIN_CHARACTER,
      rawCard.main_character_id - 1,
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

    // (!) UNCOMMENT IF WE END UP PROGRAMMING MORE THAN ONE CHAOTIC EVENT
    // const chaoticEventID = Math.floor(Math.random() * 4);

    const chaoticEventID = 3;
    const gottenChaoticEvent =
      globals.cardsData.main_characters[MainCharacterID.JOSEPH].chaotic_events[
        chaoticEventID
      ];
    let chaoticEventName = gottenChaoticEvent.name_eng;
    let chaoticEventDescription = gottenChaoticEvent.description_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      chaoticEventName = gottenChaoticEvent.name_eus;
      chaoticEventDescription = gottenChaoticEvent.description_eus;
    }

    // DETERMINE HOW MANY ROUNDS WILL JOSEPH'S CHAOTIC EVENT LAST WHEN HIS CARD IS DRAWN FROM THE EVENTS DECK
    const MIN_ROUNDS = 3;
    const MAX_ROUNDS = 6;
    const durationInRounds =
      Math.floor(Math.random() * (MAX_ROUNDS - MIN_ROUNDS + 1)) + MIN_ROUNDS;

    const processedCard = new Joseph(
      CardCategory.MAIN_CHARACTER,
      rawCard.main_character_id - 1,
      rawCardName,
      rawCardDescription,
      chaoticEventID,
      chaoticEventName,
      chaoticEventDescription,
      durationInRounds
    );

    return processedCard;
  }

  #createMinion(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardTypeName = rawCard.category.name_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardTypeName = rawCard.category.name_eus;
    }

    const processedCard = new Minion(
      CardCategory.MINION,
      rawCard.minion_id - 1,
      rawCardName,
      rawCardDescription,
      rawCard.category_id - 1,
      rawCardTypeName,
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
    let rawCardTypeName = rawCard.type.name_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardTypeName = rawCard.type.name_eus;
    }

    const processedCard = new Weapon(
      CardCategory.WEAPON,
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCard.type_id - 1,
      rawCardTypeName,
      rawCard.damage,
      rawCard.durability,
      rawCard.prep_time_in_rounds
    );

    return processedCard;
  }

  #createArmor(rawCard) {
    let rawCardName = rawCard.name_eng;
    let rawCardDescription = rawCard.description_eng;
    let rawCardTypeName = rawCard.type.name_eng;
    let rawCardSpecialEffect = rawCard.special_effect_eng;

    if (globals.language === Language.BASQUE) {
      rawCardName = rawCard.name_eus;
      rawCardDescription = rawCard.description_eus;
      rawCardTypeName = rawCard.type.name_eus;
      rawCardSpecialEffect = rawCard.special_effect_eus;
    }

    const processedCard = new Armor(
      CardCategory.ARMOR,
      rawCard.id - 1,
      rawCardName,
      rawCardDescription,
      rawCard.type_id - 1,
      rawCardTypeName,
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
      CardCategory.SPECIAL,
      rawCard.special_event_id - 1,
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
      CardCategory.RARE,
      rawCard.rare_event_id - 1,
      rawCardName,
      rawCardDescription,
      rawCardEffect,
      rawCard.duration_in_rounds,
      0
    );

    return processedCard;
  }

  createCard(cardID, cardCategory) {
    let rawCard;
    let processedCard;

    switch (cardCategory) {
      case "main_characters":
        rawCard = globals.cardsData.main_characters[cardID];
        if (cardID !== MainCharacterID.JOSEPH) {
          processedCard = this.#createMainCharacter(rawCard);
        } else {
          processedCard = this.#createJoseph(rawCard);
        }
        break;

      case "minions":
        rawCard = globals.cardsData.minions[cardID];
        processedCard = this.#createMinion(rawCard);
        break;

      case "weapons":
        rawCard = globals.cardsData.weapons[cardID];
        processedCard = this.#createWeapon(rawCard);
        break;

      case "armor":
        rawCard = globals.cardsData.armor[cardID];
        processedCard = this.#createArmor(rawCard);
        break;

      case "special_events":
        rawCard = globals.cardsData.special_events[cardID];
        processedCard = this.#createSpecial(rawCard);
        break;

      case "rare_events":
        rawCard = globals.cardsData.rare_events[cardID];
        processedCard = this.#createRare(rawCard);
        break;
    }

    return processedCard;
  }
}
