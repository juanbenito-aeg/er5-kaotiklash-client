const Language = {
  ENGLISH: 0,
  BASQUE: 1,
};

const Category = {
  MAIN_CHARACTERS: 0,
  MINIONS: 1,
  EVENTS: 2,
  PREPARATION_EVENTS: 3,
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
