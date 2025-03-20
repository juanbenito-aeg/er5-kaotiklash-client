import Player from "./Player.js";
import CardView from "../Decks/CardView.js";
import Deck from "../Decks/Deck.js";
import DeckCreator from "../Decks/DeckCreator.js";
import GridCreator from "../Board/GridCreator.js";
import Turn from "../Turns/Turn.js";
import MouseInput from "./MouseInput.js";
import {
  GameState,
  CardCategory,
  WeaponType,
  ArmorType,
  MinionType,
  IconID,
  TemplateID,
} from "./constants.js";
import { globals } from "../index.js";
import ImageSet from "./ImageSet.js";
import InitialPhase from "../Turns/InitialPhase.js";

export default class Game {
  #players;
  #currentPlayer;
  #deckContainer;
  #board;
  #turns;
  #mouseInput;

  static async create() {
    // "game" OBJECT CREATION
    const game = new Game();

    // PLAYERS CREATION
    const player1 = new Player("Player 1");
    const player2 = new Player("Player 2");
    game.#players = [player1, player2];

    // RANDOMLY ASSIGN PLAYER THAT STARTS PLAYING
    game.#currentPlayer = Math.floor(Math.random() * 2);

    // MAIN DECK CONFIGURATION FILE LOAD
    const url = "./src/mainDeck.json";
    const response = await fetch(url);
    const mainDeckConfig = await response.json();

    // DECKS CREATION
    const deckCreator = new DeckCreator(mainDeckConfig);
    game.#deckContainer = deckCreator.createMainDeck();
    game.#deckContainer = deckCreator.createAllDecks(
      game.#deckContainer.getDecks()[0]
    );

    // APPLICATION OF THE "CardView" DECORATOR TO ALL CARDS
    game.#applyCardViewToAllCards();

    // GRIDS (BOARD) CREATION
    const gridCreator = new GridCreator();
    game.#board = gridCreator.createAllGrids();
    game.#board.setImage(globals.boardImage);

    // TURNS CREATION
    const turnPlayer1 = new Turn(0, game.#deckContainer, game.#board, null, game.#currentPlayer);
    const turnPlayer2 = new Turn(0, game.#deckContainer, game.#board, null, game.#currentPlayer);
    game.#turns = [turnPlayer1, turnPlayer2];
  
    game.#turns[game.#currentPlayer].create();
    
    // MOUSEINPUT CREATION
    game.#mouseInput = new MouseInput();
    game.#mouseInput.mouseEventListener();

    return game;
  }

  execute() {
    this.#update();
    this.#render();
  }

  #update() {

  }

  #render() {
    this.#renderBoard();

    switch (globals.gameState) {
      case GameState.GRIDS_DRAWING:
        this.#renderGrids();
        this.#renderElements();
        break;

        case GameState.ELEMENT_RENDER:
          //this.#renderElements();
          break;
    }
  }

  #renderBoard() {
    globals.ctx.drawImage(
      globals.boardImage,
      0,
      0,
      3584,
      2048,
      0,
      0,
      globals.canvas.width,
      globals.canvas.height
    );
  }

  #renderGrids() {
    const colors = [
      "white",
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "pink",
      "darkcyan",
      "magenta",
      "cyan",
      "gold",
      "grey",
      "bisque",
      "black",
      "blueviolet",
    ];

    for (let i = 0; i < this.#board.getGrids().length; i++) {
      const currentGrid = this.#board.getGrids()[i];

      for (let j = 0; j < currentGrid.getBoxes().length; j++) {
        const currentBox = currentGrid.getBoxes()[j];

        globals.ctx.strokeStyle = colors[i];
        globals.ctx.strokeRect(
          currentBox.getXCoordinate(),
          currentBox.getYCoordinate(),
          currentBox.getWidth(),
          currentBox.getHeight()
        );
      }
    }
  }

  #applyCardViewToAllCards() {
    const updatedDecks = [];

    for (let i = 0; i < this.#deckContainer.getDecks().length; i++) {
      const currentDeck = this.#deckContainer.getDecks()[i];

      const updatedDeck = new Deck(i, []);
      updatedDecks.push(updatedDeck);

      for (let j = 0; j < currentDeck.getCards().length; j++) {
        let currentCard = currentDeck.getCards()[j];

        // CREATION OF OBJECTS FOR THE CURRENT CARD'S IMAGESET

        let cardImage;
        let smallVersionTemplateImage;
        let bigVersionTemplateImage;
        let iconsImages = [
          globals.cardsIconsImages[IconID.EVENT_EFFECT_DIAMOND],
          globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
          globals.cardsIconsImages[IconID.EVENT_DURATION_DIAMOND],
        ];

        if (currentCard.getCategory() === CardCategory.MAIN_CHARACTER) {
          cardImage = globals.cardsImages.main_characters[currentCard.getID()];

          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_SMALL];

          bigVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MAIN_CHARACTERS_BIG];

          iconsImages = [];
        } else {
          smallVersionTemplateImage =
            globals.cardsTemplatesImages[TemplateID.MINIONS_AND_EVENTS_SMALL];

          if (currentCard.getCategory() === CardCategory.MINION) {
            cardImage = globals.cardsImages.minions[currentCard.getID()];

            iconsImages = [
              globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImages[IconID.MINION_HP_DIAMOND],
              globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
            ];

            if (currentCard.getMinionType() === MinionType.SPECIAL) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_SPECIAL_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_SPECIAL_TYPE]
              );
            } else if (currentCard.getMinionType() === MinionType.WARRIOR) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WARRIORS_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_WARRIOR_TYPE]
              );
            } else {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.MINIONS_WIZARDS_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.MINION_WIZARD_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.WEAPON) {
            cardImage = globals.cardsImages.weapons[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.WEAPONS_BIG];

            iconsImages = [
              globals.cardsIconsImages[IconID.ATTACK_DAMAGE_DIAMOND],
              globals.cardsIconsImages[IconID.EVENT_PREP_TIME_DIAMOND],
              globals.cardsIconsImages[IconID.DEFENSE_DURABILITY_DIAMOND],
              globals.cardsIconsImages[IconID.EVENT_TYPE_CIRCLE],
            ];

            if (currentCard.getWeaponType() === WeaponType.MELEE) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_MELEE_TYPE]
              );
            } else if (currentCard.getWeaponType() === WeaponType.MISSILE) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_MISSILE_TYPE]
              );
            } else {
              iconsImages.push(
                globals.cardsIconsImages[IconID.WEAPON_HYBRID_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.ARMOR) {
            cardImage = globals.cardsImages.armor[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

            if (currentCard.getArmorType() === ArmorType.LIGHT) {
              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_LIGHT_TYPE]
              );
            } else if (currentCard.getArmorType() === ArmorType.MEDIUM) {
              bigVersionTemplateImage =
                globals.cardsTemplatesImages[TemplateID.ARMOR_LIGHT_HEAVY_BIG];

              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_MEDIUM_TYPE]
              );
            } else {
              iconsImages.push(
                globals.cardsIconsImages[IconID.ARMOR_HEAVY_TYPE]
              );
            }
          } else if (currentCard.getCategory() === CardCategory.SPECIAL) {
            cardImage = globals.cardsImages.special[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.SPECIAL_EVENTS_BIG];
          } else {
            cardImage = globals.cardsImages.rare[currentCard.getID()];

            bigVersionTemplateImage =
              globals.cardsTemplatesImages[TemplateID.RARE_EVENTS_BIG];
          }
        }

        const imageSet = new ImageSet(
          globals.cardsReverseImage,
          cardImage,
          smallVersionTemplateImage,
          bigVersionTemplateImage,
          iconsImages
        );

        currentCard = new CardView(currentCard, 0, 0, imageSet);

        updatedDeck.insertCard(currentCard);
      }
    }

    this.#deckContainer.setDecks(updatedDecks);
  }

  #renderElements() 
  {
    globals.currentPlayer = 2;
    console.log(this.#deckContainer.getDecks()[3]);
    this.#renderPlayers();
    this.#renderDeckReverses();
    this.#renderPhasesButtons();
    this.#renderActiveEventsTable();
    this.#renderMessages();
    this.#renderPlayer1MinionActiveCards();
    this.#renderPlayer2MinionActiveCards();
    if(globals.currentPlayer == 1)
    {
      this.#renderEventHandPlayer1Cards();
    }
    else
    {
    this.#renderEventHandPlayer2Cards();
    }
  }

  #renderPlayers() {
    this.#renderMainCharacters();
    let player1MinionsHp = 0;
    let player2MinionsHp = 0;
  
    // Definir decks de minions para ambos jugadores
    const player1MinionsDeck = this.#deckContainer.getDecks()[4].getCards();
    const player1MinionsInPlayDeck = this.#deckContainer.getDecks()[5].getCards();
  
    const player2MinionsDeck = this.#deckContainer.getDecks()[4].getCards();
    const player2MinionsInPlayDeck = this.#deckContainer.getDecks()[5].getCards();
  
    // Función para sumar la vida de los minions de un jugador
    function sumMinionsHp(minionsDeck) {
      let totalHp = 0;
      let length = minionsDeck.length - 1;
      for (let i = 0; i < length; i++) {
        const card = minionsDeck[i];
        const hp = card.getCard().getHp();
        totalHp += hp;
      }
      return totalHp;
    }
  
    // Sumar la vida de los minions de ambos jugadores
    player1MinionsHp = sumMinionsHp(player1MinionsDeck) + sumMinionsHp(player1MinionsInPlayDeck);
    player2MinionsHp = sumMinionsHp(player2MinionsDeck) + sumMinionsHp(player2MinionsInPlayDeck);
  
  // Determinar posiciones en función del jugador actual (invertidos)
  let player1X, player1Y, player2X, player2Y;

  if (globals.currentPlayer === 1) {
    player1X = 2120; player1Y = 1065;  // Ahora en la parte inferior
    player2X = 300; player2Y = 285;    // Ahora en la parte superior
  } else {
    player1X = 300; player1Y = 285;    // Ahora en la parte superior
    player2X = 2120; player2Y = 1065;  // Ahora en la parte inferior
  }

  // Renderizar la información de los jugadores
  globals.ctx.font = "20px MedievalSharp";
  globals.ctx.fillStyle = "yellow";
  globals.ctx.fillText("Player 1", player1X, player1Y);
  globals.ctx.fillText("HP: " + player1MinionsHp, player1X, player1Y + 25);

  globals.ctx.font = "20px MedievalSharp";
  globals.ctx.fillStyle = "yellow";
  globals.ctx.fillText("Player 2", player2X, player2Y);
  globals.ctx.fillText("HP: " + player2MinionsHp, player2X, player2Y + 25);
}

#renderDeckReverses()
{
  this.#renderPlayer1MinionsDeck(420, 60);

  this.#renderPlayer2MinionsDeck(1800, 840);

  this.#renderEventsDeck(1890, 550);
}

#renderPlayer1MinionsDeck(xCoordinate, yCoordinate) {
  globals.ctx.drawImage(
    globals.cardsReverseImage,
    0,
    0,
    425,
    587,
    xCoordinate,
    yCoordinate,
    200,
    200
  );
}

#renderPlayer2MinionsDeck(xCoordinate, yCoordinate) {
  globals.ctx.drawImage(
    globals.cardsReverseImage,
    0,
    0,
    425,
    587,
    xCoordinate,
    yCoordinate,
    200,
    200
  );
}

#renderEventsDeck(xCoordinate, yCoordinate) {
  globals.ctx.drawImage(
    globals.cardsReverseImage,
    0,
    0,
    425,
    587,
    xCoordinate,
    yCoordinate,
    200,
    200
  );
}

#renderMainCharacters() {
  const player1Card = this.#deckContainer.getDecks()[2].getCards()[0];
  const player2Card = this.#deckContainer.getDecks()[8].getCards()[0];

  let player1X, player1Y, player2X, player2Y;
  let smallSizeX = 200;
  let smallSizeY = 200;

  if (globals.currentPlayer === 1) {
      // Player 1 abajo, Player 2 arriba
      player1X = 2020; player1Y = 840;
      player2X = 200; player2Y = 60;
  } else {
      // Player 1 arriba, Player 2 abajo
      player1X = 200; player1Y = 60;
      player2X = 2020; player2Y = 840;
  }

  // Renderizar cartas en sus posiciones respectivas
  this.#renderCard(player1Card, player1X, player1Y, smallSizeX, smallSizeY);
  this.#renderSmallTemplate(player1Card, player1X, player1Y, smallSizeX, smallSizeY);

  this.#renderCard(player2Card, player2X, player2Y, smallSizeX, smallSizeY);
  this.#renderSmallTemplate(player2Card, player2X, player2Y, smallSizeX, smallSizeY);
}


#renderPhasesButtons() {
  const phaseNumber = ["Skip", "Attack", "Prepare Event", "Move", "Perform Event"];
  const buttonCount = phaseNumber.length;
  
  for (let j = 0; j < buttonCount; j++) {
      const currentPhase = phaseNumber[j];
      const x = 400; // Posición fija a la izquierda
      const y = 705 + j * 50; // Espaciado vertical entre botones
      const width = 200;
      const height = 40;
      const radius = 10;

      // Sombra
      globals.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      globals.ctx.shadowBlur = 10;
      globals.ctx.shadowOffsetX = 4;
      globals.ctx.shadowOffsetY = 4;

      // Dibujar botón
      globals.ctx.fillStyle = 'darkcyan';
      globals.ctx.beginPath();
      globals.ctx.moveTo(x + radius, y);
      globals.ctx.lineTo(x + width - radius, y);
      globals.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      globals.ctx.lineTo(x + width, y + height - radius);
      globals.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      globals.ctx.lineTo(x + radius, y + height);
      globals.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      globals.ctx.lineTo(x, y + radius);
      globals.ctx.quadraticCurveTo(x, y, x + radius, y);
      globals.ctx.closePath();
      globals.ctx.fill();

      // Resetear sombra
      globals.ctx.shadowBlur = 0;
      globals.ctx.shadowOffsetX = 0;
      globals.ctx.shadowOffsetY = 0;

      // Texto del botón
      globals.ctx.fillStyle = 'white';
      globals.ctx.font = '18px MedievalSharp';
      globals.ctx.textAlign = 'center';
      globals.ctx.textBaseline = 'middle';
      globals.ctx.fillText(currentPhase, x + width / 2, y + height / 2);
  }
}


#renderActiveEventsTable() {
  const tableX = 1790; // Posición fija a la izquierda
  const tableY = 210;
  const tableWidth = 400;
  const tableHeight = 300;
  
  // Sombra
  globals.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  globals.ctx.shadowBlur = 10;
  globals.ctx.shadowOffsetX = 4;
  globals.ctx.shadowOffsetY = 4;
  
  // Dibujar la tabla
  globals.ctx.fillStyle = 'darkcyan';
  globals.ctx.fillRect(tableX, tableY, tableWidth, tableHeight);
  
  // Resetear sombra
  globals.ctx.shadowBlur = 0;
  globals.ctx.shadowOffsetX = 0;
  globals.ctx.shadowOffsetY = 0;

  // Bordes de la tabla
  globals.ctx.strokeStyle = "black";
  globals.ctx.lineWidth = 2;

  let columnWidth = tableWidth / 3;

  // Dibujar columnas
  for (let i = 1; i <= 2; i++) {
      let columnX = tableX + columnWidth * i;
      globals.ctx.beginPath();
      globals.ctx.moveTo(columnX, tableY);
      globals.ctx.lineTo(columnX, tableY + tableHeight);
      globals.ctx.stroke();
  }

  // Dibujar filas
  for (let i = 1; i < 4; i++) {
      let lineY = tableY + (tableHeight / 4) * i;
      globals.ctx.beginPath();
      globals.ctx.moveTo(tableX, lineY);
      globals.ctx.lineTo(tableX + tableWidth, lineY);
      globals.ctx.stroke();
  }

  // Texto de encabezados
  globals.ctx.fillStyle = 'white';
  globals.ctx.font = '18px MedievalSharp';
  globals.ctx.textAlign = 'center';
  globals.ctx.textBaseline = 'middle';

  globals.ctx.fillText("Player", tableX + columnWidth / 2, tableY + tableHeight / 8);
  globals.ctx.fillText("Event", tableX + columnWidth * 1.5, tableY + tableHeight / 8);
  globals.ctx.fillText("Duration", tableX + columnWidth * 2.5, tableY + tableHeight / 8);

  // Datos de ejemplo
  globals.ctx.fillStyle = 'black';
  globals.ctx.fillText("Player 2", tableX + columnWidth / 2, tableY + tableHeight - 185);
  globals.ctx.fillText("Hand of God", tableX + columnWidth * 1.5, tableY + tableHeight - 185);
  globals.ctx.fillText("2 rounds", tableX + columnWidth * 2.5, tableY + tableHeight - 185);
}


#renderMessages() {
  const messageBoxX = 1790;  // Posición fija a la izquierda
  const messageBoxY = 10;
  const messageBoxWidth = 420;
  const messageBoxHeight = 185;

  // Dibujar el cuadro de mensajes
  globals.ctx.fillStyle = 'black';
  globals.ctx.fillRect(messageBoxX, messageBoxY, messageBoxWidth, messageBoxHeight);

  // Texto dentro del cuadro
  globals.ctx.fillStyle = 'white';
  globals.ctx.font = '20px MedievalSharp';
  globals.ctx.textAlign = "center";
  globals.ctx.textBaseline = "middle";
  globals.ctx.fillText("COMING SOON", messageBoxX + messageBoxWidth / 2, messageBoxY + messageBoxHeight / 2);
}

#renderPlayer1MinionActiveCards() {
  const player1MinionsInPlayDeck = this.#deckContainer.getDecks()[5].getCards();

// Posiciones fijas de los minions
let fixedPositions = [];
if(globals.currentPlayer === 1)
{
fixedPositions = [

  { x: 1105, y: 580 },    // (1,3)
  { x: 970, y: 715 },    // (2,3)
  { x: 835, y: 850 },    // (3,3)

];
}
else
{
fixedPositions = [

    { x: 1105, y: 170 },    // (1,3)
    { x: 970, y: 305 },    // (2,3)
    { x: 835, y: 170 },    // (3,3)
    
  ];
}

  for (let i = 0; i < player1MinionsInPlayDeck.length && i < fixedPositions.length; i++) {
    const currentCard = player1MinionsInPlayDeck[i];
    const { x, y } = fixedPositions[i]; // Obtener coordenadas fijas

    let smallSizeX = 110;
    let smallSizeY = 110;

    this.#renderCard(currentCard, x, y, smallSizeX, smallSizeY);
    this.#renderSmallTemplate(currentCard, x, y, smallSizeX, smallSizeY);
    this.#renderIcons(currentCard, x, y);
    this.#renderAttributesMinions(currentCard, x, y);
  }
}

#renderPlayer2MinionActiveCards() {
  const player2MinionsInPlayDeck = this.#deckContainer.getDecks()[11].getCards();

  let fixedPositions = [];
  if(globals.currentPlayer === 1)
  {
  fixedPositions = [
  
      { x: 1105, y: 170 },    // (1,3)
      { x: 970, y: 305 },    // (2,3)
      { x: 835, y: 170 },    // (3,3)

  ];
  }
  else
  {
  fixedPositions = [
  
      { x: 1105, y: 850 },    // (1,3)
      { x: 970, y: 715 },    // (2,3)
      { x: 835, y: 850 },    // (3,3)
        
    ];
  }

  for (let i = 0; i < player2MinionsInPlayDeck.length && i < fixedPositions.length; i++) {
    const currentCard = player2MinionsInPlayDeck[i];
    const { x, y } = fixedPositions[i]; // Obtener coordenadas fijas

    let smallSizeX = 110;
    let smallSizeY = 110;

    this.#renderCard(currentCard, x, y, smallSizeX, smallSizeY);
    this.#renderSmallTemplate(currentCard, x, y, smallSizeX, smallSizeY);
    this.#renderIcons(currentCard, x, y);
    this.#renderAttributesMinions(currentCard, x, y);
  }
}

#renderEventHandPlayer1Cards() {

    const MinionPlayer1 = this.#deckContainer.getDecks()[3];

    for(let i = 0; i < MinionPlayer1.getCards().length ; i++)
    {
      const currentCard = MinionPlayer1.getCards()[i];
      let xCoordinate = 680 + i * 135;
      let yCoordinate = 987;
      let smallSizeX = 110;
      let smallSizeY = 110;
      this.#renderCard(currentCard, xCoordinate, yCoordinate, smallSizeX, smallSizeY);
      this.#renderSmallTemplate(currentCard, xCoordinate, yCoordinate, smallSizeX, smallSizeY);
      this.#renderIcons(currentCard, xCoordinate, yCoordinate);
      this.#renderAttributesWeaponns(currentCard, xCoordinate, yCoordinate);
      this.#renderEventHandPlayer2Reverse();
    }

    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.fillStyle = "yellow";
    globals.ctx.fillText("Player 1", 580, 990);

}

#renderEventHandPlayer2Reverse(){
  const EventPlayer2 = this.#deckContainer.getDecks()[9].getCards();
  const xCoordinate = 677;
  const yCoordinate = 23;
  for( let i = 0; i < EventPlayer2.length; i++)
  {
    globals.ctx.drawImage(
      globals.cardsReverseImage,
      0,
      0,
      425,
      587,
      xCoordinate +  i*135,
      yCoordinate,
      115,
      115
    );
  }

}

#renderEventHandPlayer2Cards() {

    const EventPlayer1 = this.#deckContainer.getDecks()[9].getCards();

    for(let i = 0; i < EventPlayer1.length ; i++)
    {
      const currentCard = EventPlayer1[i];
      let xCoordinate = 680 + i * 135;
      let yCoordinate = 987;
      let smallSizeX = 110;
      let smallSizeY = 110;
      this.#renderCard(currentCard, xCoordinate, yCoordinate, smallSizeX, smallSizeY);
      this.#renderSmallTemplate(currentCard, xCoordinate, yCoordinate, smallSizeX, smallSizeY);
      this.#renderIcons(currentCard, xCoordinate, yCoordinate);
      this.#renderAttributesWeaponns(currentCard, xCoordinate, yCoordinate);
      this.#renderEventHandPlayer1Reverse();
    }

    globals.ctx.font = "20px MedievalSharp";
    globals.ctx.fillStyle = "yellow";
    globals.ctx.fillText("Player 2", 580, 990);
}

#renderEventHandPlayer1Reverse(){
  const EventPlayer1 = this.#deckContainer.getDecks()[3].getCards();
  const xCoordinate = 677;
  const yCoordinate = 23;
  for( let i = 0; i < EventPlayer1.length; i++)
  {
    globals.ctx.drawImage(
      globals.cardsReverseImage,
      0,
      0,
      425,
      587,
      xCoordinate +  i*135,
      yCoordinate,
      115,
      115
    );
  }

}

#renderCard(card, xCoordinate, yCoordinate, sizeX, sizeY) {
  globals.ctx.drawImage(
    card.getImageSet().getCard(),
    0,
    0,
    1024,
    1024,
    xCoordinate,
    yCoordinate,
    sizeX,
    sizeY
  );
}
#renderSmallTemplate(card, xCoordinate, yCoordinate, sizeX, sizeY) {
  globals.ctx.drawImage(
    card.getImageSet().getSmallVersionTemplate(),
    0,
    0,
    625,
    801,
    xCoordinate,
    yCoordinate,
    sizeX,
    sizeY
  );
}
#renderIcons(card, xCoordinate, yCoordinate) {
  const icons = card.getImageSet().getIcons();
  
  const positions = [
    { x: xCoordinate - 17, y: yCoordinate + 40, width: 35, height: 35 },  // left
    { x: xCoordinate + 37, y: yCoordinate + 92, width: 35, height: 35 },  // bottom
    { x: xCoordinate + 92, y: yCoordinate + 40, width: 35, height: 35 },  // right
    { x: xCoordinate + 37, y: yCoordinate - 17, width: 35, height: 35 },  // top
    { x: xCoordinate + 46, y: yCoordinate - 8, width: 17, height: 17 }   // top (smaller size)
  ];

  for (let i = 0; i < icons.length; i++) {
    const { x, y, width, height } = positions[i];
    globals.ctx.drawImage(icons[i], 0, 0, 100, 100, x, y, width, height);
  }
}

#renderAttributesMinions(card, xCoordinate, yCoordinate) {
  const attack = card.getCard().getAttack();
  const hp = card.getCard().getHp();
  const defense = card.getCard().getDefense();
  
  globals.ctx.fillStyle = 'black';
  globals.ctx.font = '14px MedievalSharp';
  globals.ctx.textAlign = 'center';
  globals.ctx.textBaseline = 'middle';
  
  globals.ctx.fillText(attack, xCoordinate, yCoordinate + 58);
  globals.ctx.fillText(hp, xCoordinate + 55, yCoordinate + 110);
  globals.ctx.fillText(defense, xCoordinate + 110, yCoordinate + 58);
  
}

#renderAttributesWeaponns(card, xCoordinate, yCoordinate) {
  const damage = card.getCard().getDamage();
  const prep_time = card.getCard().getPrepTimeInRounds();
  const durability = card.getCard().getDurability();
  
  globals.ctx.fillStyle = 'black';
  globals.ctx.font = '14px MedievalSharp';
  globals.ctx.textAlign = 'center';
  globals.ctx.textBaseline = 'middle';
  
  globals.ctx.fillText(damage, xCoordinate, yCoordinate + 58);
  globals.ctx.fillText(prep_time, xCoordinate + 55, yCoordinate + 110);
  globals.ctx.fillText(durability, xCoordinate + 110, yCoordinate + 58);
  
}
}
