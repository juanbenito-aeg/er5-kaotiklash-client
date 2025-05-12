const GameState = {
  INVALID: -1,
  PLAYING: 0,
  CHAT_PAUSE: 1,
};

// FPS (FRAMES PER SECOND)
const FPS = 30;

const Language = {
  ENGLISH: 0,
  BASQUE: 1,
};

const PlayerID = {
  PLAYER_1: 0,
  PLAYER_2: 1,
};

const TemplateID = {
  MAIN_CHARACTERS_SMALL: 0,
  MINIONS_AND_EVENTS_SMALL: 1,
  RARE_EVENTS_BIG: 2,
  SPECIAL_EVENTS_BIG: 3,
  MINIONS_WARRIORS_BIG: 4,
  MINIONS_WIZARDS_BIG: 5,
  MINIONS_SPECIAL_BIG: 6,
  JOSEPH_BIG: 7,
  MAIN_CHARACTERS_BIG: 8,
  ARMOR_MEDIUM_BIG: 9,
  ARMOR_LIGHT_HEAVY_BIG: 10,
  WEAPONS_BIG: 11,
};

const IconID = {
  ATTACK_DAMAGE_DIAMOND: 0,
  DEFENSE_DURABILITY_DIAMOND: 1,
  MINION_SPECIAL_TYPE: 2,
  MINION_WARRIOR_TYPE: 3,
  MINION_WIZARD_TYPE: 4,
  MINION_HP_DIAMOND: 5,
  EVENT_TYPE_CIRCLE: 6,
  EVENT_PREP_TIME_DIAMOND: 7,
  EVENT_DURATION_DIAMOND: 8,
  EVENT_EFFECT_DIAMOND: 9,
  WEAPON_MELEE_TYPE: 10,
  WEAPON_MISSILE_TYPE: 11,
  WEAPON_HYBRID_TYPE: 12,
  ARMOR_LIGHT_TYPE: 13,
  ARMOR_MEDIUM_TYPE: 14,
  ARMOR_HEAVY_TYPE: 15,
  SPECIAL_TYPE: 16,
  RARE_TYPE: 17,
  MINION_HP: 18,
  MINION_MADNESS: 19,
  MINION_ATTACK: 20,
  MINION_DEFENSE: 21,
  WEAPON_DAMAGE: 22,
  WEAPON_ARMOR_DURABILITY: 23,
  EVENT_PREP_TIME: 24,
  EVENT_EFFECT: 25,
  EVENT_DURATION: 26,
};

const CardCategory = {
  ARMOR: 0,
  MAIN_CHARACTER: 1,
  MINION: 2,
  RARE: 3,
  SPECIAL: 4,
  WEAPON: 5,
};

const MinionTypeID = {
  SPECIAL: 0,
  WARRIOR: 1,
  WIZARD: 2,
};

const WeaponTypeID = {
  MELEE: 0,
  MISSILE: 1,
  HYBRID: 2,
};

const ArmorTypeID = {
  LIGHT: 0,
  MEDIUM: 1,
  HEAVY: 2,
};

const DeckType = {
  EVENTS: 0,
  ACTIVE_EVENTS: 1,
  JOSEPH: 2,
  PLAYER_1_MAIN_CHARACTER: 3,
  PLAYER_1_CARDS_IN_HAND: 4,
  PLAYER_1_MINIONS: 5,
  PLAYER_1_MINIONS_IN_PLAY: 6,
  PLAYER_1_EVENTS_IN_PREPARATION: 7,
  PLAYER_2_MAIN_CHARACTER: 8,
  PLAYER_2_CARDS_IN_HAND: 9,
  PLAYER_2_MINIONS: 10,
  PLAYER_2_MINIONS_IN_PLAY: 11,
  PLAYER_2_EVENTS_IN_PREPARATION: 12,
  LUCRETIA_DEERS: 13,
  MAIN: 14,
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
  INACTIVE: 0,
  MOVING: 1,
  PLACED: 2,
  INACTIVE_HOVERED: 3,
  HOVERED: 4,
  INACTIVE_SELECTED: 5,
  SELECTED: 6,
  EXPANDED: 7,
};

const BoxState = {
  INACTIVE: 0,
  AVAILABLE: 1,
  INACTIVE_HOVERED: 2,
  HOVERED: 3,
  INACTIVE_SELECTED: 4,
  SELECTED: 5,
  OCCUPIED: 6,
};

const AttackPhaseState = {
  INIT: 0,
  SELECT_ATTACKER: 1,
  SELECT_TARGET: 2,
  ATTACK_MENU: 3,
  CALC_AND_APPLY_DMG: 4,
  END: 5,
};

const DiscardCardState = {
  INIT: 0,
  CARD_DISCARD: 1,
  END: 2,
};

const MovePhaseState = {
  INIT: 0,
  SELECT_CARD: 1,
  SELECT_TARGET: 2,
  MOVE_CARD: 3,
  ANIMATION_CARD: 4,
  END: 5,
};

const PrepareEventState = {
  INIT: 0,
  SELECT_HAND_CARD: 1,
  SELECT_TARGET_GRID: 2,
  END: 3,
};

const PerformEventState = {
  INIT: 0,
  SELECT_PREPARED_EVENT: 1,
  EXECUTE_SELECTED_EVENT: 2,
  END: 3,
};

const GridType = {
  EVENTS_DECK: 0,
  ACTIVE_EVENTS_TABLE: 1,
  JOSEPH: 2,
  MESSAGES: 3,
  PHASE_BUTTONS: 4,
  PLAYER_1_MAIN_CHARACTER: 5,
  PLAYER_1_MINIONS_DECK: 6,
  PLAYER_1_CARDS_IN_HAND: 7,
  PLAYER_1_BATTLEFIELD: 8,
  PLAYER_1_PREPARE_EVENT: 9,
  PLAYER_2_MAIN_CHARACTER: 10,
  PLAYER_2_MINIONS_DECK: 11,
  PLAYER_2_CARDS_IN_HAND: 12,
  PLAYER_2_BATTLEFIELD: 13,
  PLAYER_2_PREPARE_EVENT: 14,
};

const BattlefieldArea = {
  NONE: 0,
  REAR: 1,
  MIDDLE: 2,
  FRONT: 3,
};

const PhaseType = {
  INVALID: -1,
  DRAW_CARD: 0,
  PREPARE_EVENT: 1,
  PERFORM_EVENT: 2,
  MOVE: 3,
  ATTACK: 4,
  DISCARD_CARD: 5,
  SKIP: 6,
  EQUIP_WEAPON: 7,
};

const PhaseButton = {
  SKIP_OR_CANCEL: 0,
  PREPARE_EVENT: 1,
  PERFORM_EVENT: 2,
  MOVE: 3,
  ATTACK: 4,
};

const PhaseButtonData = {
  X_COORDINATE: 0,
  Y_COORDINATE: 1,
  WIDTH: 2,
  HEIGHT: 3,
  NAME: 4,
};

const EquipWeaponOrArmorState = {
  INIT: 0,
  SELECT_WEAPON_OR_ARMOR: 1,
  SELECT_MINION: 2,
  EQUIP_WEAPON_OR_ARMOR: 3,
  END: 4,
};

const EventCooldownState = {
  UNINITIALIZED: 0,
  INITIALIZED: 1,
};

const SpecialEventID = {
  SUMMON_CHARACTER: 0,
  JUDGMENT_ANCIENTS: 1,
  RAY_OF_CELESTIAL_RUIN: 2,
  POISON_OF_THE_ABYSS: 3,
  CURSE_OF_THE_BOUND_TITAN: 4,
  BARTENDERS_POWER: 5,
  BROOM_FURY: 6,
  BLESSING_WAITRESS: 7,
};

const RareEventID = {
  STOLEN_FATE: 0,
  HAND_OF_THE_SOUL_THIEF: 1,
  ECHO_OF_THE_STRATAGEN: 2,
  SHIELD_OF_BALANCE: 3,
  MARCH_OF_THE_LAST_SIGH: 4,
  THE_CUP_OF_THE_LAST_BREATH: 5,
};

const EchoOfTheStratagenState = {
  INIT: 0,
  SELECT_ENEMY_PREP_EVENT: 1,
  END: 2,
};

const BlessingWaitressState = {
  INIT: 0,
  SELECT_MINION: 1,
  HEAL: 2,
};

const HandOfTheSoulThiefState = {
  INIT: 0,
  SELECT_ENEMY_CARD_TO_STEAL: 1,
  SELECT_CARD_TO_EXCHANGE: 2,
  END: 3,
};

const StolenFateState = {
  DISCARD_CARDS: 0,
  DRAW_CARDS: 1,
};

const AttackMenuBtn = {
  BLOCK_ATTACK: 0,
  ARMOR_POWER: 1,
  PASS: 2,
};

const ArmorID = {
  BREASTPLATE_PRIMORDIAL_COLOSSUS: 0,
  CLOAK_ETERNAL_SHADOW: 1,
  ARMOR_OF_TITANIC_FURY: 2,
  BRACERS_OF_THE_WAR_LION: 3,
  SHIELD_OF_THE_ANCESTRAL_OAK: 5,
  VEST_OF_THE_SPECTRAL_BARTENDER: 6,
};

const ChatMessageType = {
  MAIN_CHARACTERS: 0,
  MINIONS: 1,
  JOSEPH: 2,
};

const ChatMessagePosition = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
};

const ChatMessagePhase = {
  ENTER: 0,
  STATIC: 1,
  EXIT: 2,
};

const ParticleID = {
  MINION_DEATH: 0,
};

const ParticleState = {
  ON: 0,
  FADE: 1,
  OFF: -1,
};

const ChartID = {
  WIN_RATE: 0,
  TURNS_PER_MATCH: 1,
  JOSEPH_APPEARANCES: 2,
  MINIONS_KILLED: 3,
  FUMBLES_PER_MATCH: 4,
  CRITICAL_HITS_PER_MATCH: 5,
};

export {
  GameState,
  FPS,
  Language,
  PlayerID,
  TemplateID,
  IconID,
  CardCategory,
  MinionTypeID,
  WeaponTypeID,
  ArmorTypeID,
  DeckType,
  MainCharacterID,
  ChaoticEventID,
  CardState,
  BoxState,
  GridType,
  BattlefieldArea,
  AttackPhaseState,
  DiscardCardState,
  MovePhaseState,
  PrepareEventState,
  PerformEventState,
  PhaseType,
  PhaseButton,
  PhaseButtonData,
  EquipWeaponOrArmorState,
  EventCooldownState,
  SpecialEventID,
  RareEventID,
  BlessingWaitressState,
  EchoOfTheStratagenState,
  HandOfTheSoulThiefState,
  StolenFateState,
  AttackMenuBtn,
  ArmorID,
  ChatMessageType,
  ChatMessagePosition,
  ChatMessagePhase,
  ParticleID,
  ParticleState,
  ChartID,
};
