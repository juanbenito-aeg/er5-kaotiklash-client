import Text from "../Game/Text.js";
import Message from "./Message.js";
import globals from "../Game/globals.js";
import { ChatMessagePosition, ChatMessageType } from "../Game/constants.js";

export default class ChatMessage extends Message {
  #duration;
  #type;
  #position;
  #content;
  #balloonXCoordinate;
  #balloonYCoordinate;
  #balloonWidth;
  #balloonHeight;

  constructor(
    type,
    position,
    content,
    balloonXCoordinate,
    balloonYCoordinate,
    balloonWidth,
    balloonHeight
  ) {
    super();

    this.#duration = 5;
    this.#type = type;
    this.#position = position;
    this.#content = content;
    this.#balloonXCoordinate = balloonXCoordinate;
    this.#balloonYCoordinate = balloonYCoordinate;
    this.#balloonWidth = balloonWidth;
    this.#balloonHeight = balloonHeight;
  }

  static content = [
    // MAIN CHARACTERS' CHAT MESSAGES
    ["You won't defeat me, asshole!", "Calling mommy? Hahaha"],

    // MINIONS' CHAT MESSAGES
    ["Wanna have a punch salad?", "Want me to take you home, kid?"],

    // JOSEPH'S CHAT MESSAGES
    ["You're all gonna die, freaks!"],
  ];

  static create(
    chatMessageType,
    position,
    speakerXCoordinate,
    speakerYCoordinate
  ) {
    let balloonXCoordinate = speakerXCoordinate;
    let balloonYCoordinate = speakerYCoordinate;
    let balloonWidth = 285;
    let balloonHeight = 120;
    let contentMaxCharactersPerLine;
    let contentXCoordinate;
    let contentInitialYCoordinate;

    if (chatMessageType === ChatMessageType.MAIN_CHARACTERS) {
      contentMaxCharactersPerLine = 18;

      if (position === ChatMessagePosition.UP) {
        balloonXCoordinate += 60;
        balloonYCoordinate -= 125;

        contentInitialYCoordinate = balloonYCoordinate + balloonHeight / 3;
      } else {
        balloonXCoordinate += 70;
        balloonYCoordinate -= 432;

        contentInitialYCoordinate = -balloonYCoordinate - balloonHeight / 2.25;
      }

      contentXCoordinate = balloonXCoordinate + balloonWidth / 2;
    } else if (chatMessageType === ChatMessageType.MINIONS) {
      contentMaxCharactersPerLine = 22;

      if (position === ChatMessagePosition.RIGHT) {
        balloonXCoordinate += 110;
        balloonYCoordinate -= 3;

        contentXCoordinate = balloonXCoordinate + balloonWidth / 1.8;
      } else {
        balloonXCoordinate = -balloonXCoordinate;
        balloonYCoordinate -= 4;

        contentXCoordinate = -balloonXCoordinate - balloonWidth / 1.75;
      }

      contentInitialYCoordinate = balloonYCoordinate + balloonHeight / 2.25;
    } else {
      // balloonXCoordinate += /* TODO */;
      // balloonYCoordinate += /* TODO */;
    }

    const numOfPossibleMessages = ChatMessage.content[chatMessageType].length;
    const randomMessageIndex = Math.floor(
      Math.random() * numOfPossibleMessages
    );
    const content = Text.create(
      ChatMessage.content[chatMessageType][randomMessageIndex],
      contentMaxCharactersPerLine,
      contentXCoordinate,
      contentInitialYCoordinate
    );

    const chatMessage = new ChatMessage(
      chatMessageType,
      position,
      content,
      balloonXCoordinate,
      balloonYCoordinate,
      balloonWidth,
      balloonHeight
    );

    return chatMessage;
  }

  execute() {
    let isChatMessageActive = true;

    this.#duration -= globals.deltaTime;

    if (this.#duration <= 0) {
      isChatMessageActive = false;
    }

    return isChatMessageActive;
  }

  getType() {
    return this.#type;
  }

  getPosition() {
    return this.#position;
  }

  getContentAsString() {
    return this.#content.getContentAsString();
  }

  renderContent() {
    this.#content.render();
  }

  getBalloonXCoordinate() {
    return this.#balloonXCoordinate;
  }

  getBalloonYCoordinate() {
    return this.#balloonYCoordinate;
  }

  getBalloonWidth() {
    return this.#balloonWidth;
  }

  getBalloonHeight() {
    return this.#balloonHeight;
  }
}
