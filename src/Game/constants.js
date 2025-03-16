const Language = {
  ENGLISH: 0,
  BASQUE: 1,
};

const CardCategory = {
  MAIN_CHARACTER: 0,
  MINION: 1,
  ARMOR: 2,
  WEAPON: 3,
  SPECIAL: 4,
  RARE: 5,
};

const MinionType = {
  SPECIAL: 0,
  WARRIOR: 1,
  WIZARD: 2,
};

const ArmorType = {
  LIGHT: 0,
  MEDIUM: 1,
  HEAVY: 2,
};

const DeckType = {
  MAIN: 0,
  EVENTS: 1,
  JOSEPH: 2,
  PLAYER_1_MAIN_CHARACTER: 3,
  PLAYER_1_CARDS_IN_HAND: 4,
  PLAYER_1_MINIONS: 5,
  PLAYER_1_MINIONS_IN_PLAY: 6,
  PLAYER_1_EVENTS_IN_PREPARATION: 7,
  PLAYER_1_ACTIVE_EVENTS: 8,
  PLAYER_2_MAIN_CHARACTER: 9,
  PLAYER_2_CARDS_IN_HAND: 10,
  PLAYER_2_MINIONS: 11,
  PLAYER_2_MINIONS_IN_PLAY: 12,
  PLAYER_2_EVENTS_IN_PREPARATION: 13,
  PLAYER_2_ACTIVE_EVENTS: 14,
};

const MainCharacterID = {
  LUCRETIA: 0,
  ANGELO_DI_MORTIS: 1,
  THE_ERUDITE_XG: 2,
  THE_DECREPIT_THRONE: 3,
  JOSEPH: 4,
};

const ChaoticEventID = {
  LIGHTNING_STORM: 0,
  SANDSTORM: 1,
  MINION_REBELLION: 2,
  CONSTANT_SWAP: 3,
};

const CardState = {
  NOT_SELECTED: 0,
  MOVING: 1,
  PLACED: 2,
  SELECTED: 3,
  HOVERED: 4,
  DISCARDED: 5,
};

const BoxState = {
  EMPTY: 0,
  AVARIABLE: 1,
  HOVERED: 2,
  SELECTED: 3,
  OCCUPIED: 4,
};

const DiscardCardState = {
  INIT: 0,
  SELECT_CARD_TO_DISCARD: 1,
  END: 2,
};

const MovePhaseState = {
  INIT: 0,
  SELECT_CARD: 1,
  SELECT_TARGET: 2,
  MOVE_CARD: 3,
  END: 4,
};

const PrepareEventState = {
  INIT: 0,
  SELECT_HAND_CARD: 1,
  SELECT_TARGET_GRID: 2,
  END: 3,
};

const DrawCardState = {
  INIT: 0,
  DRAW_CARD: 1,
  END: 2,
};

export {
  Language,
  CardCategory,
  MinionType,
  ArmorType,
  DeckType,
  MainCharacterID,
  ChaoticEventID,
  CardState,
  BoxState,
  DiscardCardState,
  MovePhaseState,
  PrepareEventState,
  DrawCardState,
};
