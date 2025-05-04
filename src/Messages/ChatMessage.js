import Message from "./Message.js";
import globals from "../Game/globals.js";

export default class ChatMessage extends Message {
  #duration;
  #content;
  #speakerXCoordinate;
  #speakerYCoordinate;

  constructor(content, speakerXCoordinate, speakerYCoordinate) {
    super();

    this.#duration = 6;
    this.#content = content;
    this.#speakerXCoordinate = speakerXCoordinate;
    this.#speakerYCoordinate = speakerYCoordinate;
  }

  static content = [
    // MAIN CHARACTERS' CHAT MESSAGES
    ["You won't defeat me, asshole!", "Calling mommy? Hahaha"],

    // MINIONS' CHAT MESSAGES
    ["Wanna have a punch salad?", "Want me to take you home, kid?"],

    // JOSEPH'S CHAT MESSAGES
    ["You're all gonna die, freaks!"],
  ];

  static create(chatMessageType, speakerXCoordinate, speakerYCoordinate) {
    const numOfPossibleMessages = ChatMessage.content[chatMessageType].length;
    const randomMessageIndex = Math.floor(
      Math.random() * numOfPossibleMessages
    );
    const content = ChatMessage.content[chatMessageType][randomMessageIndex];

    const chatMessage = new ChatMessage(
      content,
      speakerXCoordinate,
      speakerYCoordinate
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

  getContent() {
    return this.#content;
  }

  getSpeakerXCoordinate() {
    return this.#speakerXCoordinate;
  }

  getSpeakerYCoordinate() {
    return this.#speakerYCoordinate;
  }
}
