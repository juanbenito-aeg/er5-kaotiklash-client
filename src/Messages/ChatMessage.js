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

  constructor(type, position, content, balloonXCoordinate, balloonYCoordinate) {
    super();

    this.#duration = 26;
    this.#type = type;
    this.#position = position;
    this.#content = content;
    this.#balloonXCoordinate = balloonXCoordinate;
    this.#balloonYCoordinate = balloonYCoordinate;
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
    const numOfPossibleMessages = ChatMessage.content[chatMessageType].length;
    const randomMessageIndex = Math.floor(
      Math.random() * numOfPossibleMessages
    );
    const content = ChatMessage.content[chatMessageType][randomMessageIndex];

    let numToAddToSpeakerXCoordinate;
    let numToAddToSpeakerYCoordinate;

    if (chatMessageType === ChatMessageType.MAIN_CHARACTERS) {
      if (position === ChatMessagePosition.UP) {
        numToAddToSpeakerXCoordinate = 70;
        numToAddToSpeakerYCoordinate = -125;
      } else {
        numToAddToSpeakerXCoordinate = /* TODO */;
        numToAddToSpeakerYCoordinate = /* TODO */;
      }
    } else if (chatMessageType === ChatMessageType.MINIONS) {
      if (position === ChatMessagePosition.UP) {
        numToAddToSpeakerXCoordinate = /* TODO */;
        numToAddToSpeakerYCoordinate = /* TODO */;
      } else {
        numToAddToSpeakerXCoordinate = /* TODO */;
        numToAddToSpeakerYCoordinate = /* TODO */;
      }
    } else {
      numToAddToSpeakerXCoordinate = /* TODO */;
      numToAddToSpeakerYCoordinate = /* TODO */;
    }

    const balloonXCoordinate =
      speakerXCoordinate + numToAddToSpeakerXCoordinate;
    const balloonYCoordinate =
      speakerYCoordinate + numToAddToSpeakerYCoordinate;

    const chatMessage = new ChatMessage(
      chatMessageType,
      position,
      content,
      balloonXCoordinate,
      balloonYCoordinate
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

  getContent() {
    return this.#content;
  }

  getBalloonXCoordinate() {
    return this.#balloonXCoordinate;
  }

  getBalloonYCoordinate() {
    return this.#balloonYCoordinate;
  }
}
