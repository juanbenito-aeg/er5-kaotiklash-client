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
    [
      "You won't defeat me, asshole!",
      "Calling mommy? Hahaha",
      "Nice try, loser!",
      "Did you train with a potato?",
      "Come back when you grow a brain!",
      "That was pathetic!",
      "Is that all you've got?",
      "My grandma fights better!",
      "You're slower than a dial-up connection!",
      "Lag isn’t your only problem!",
      "Oops, did that hurt?",
      "Try again, noob!",
      "You camping coward!",
      "Get out and fight like a man!",
      "This is my world now!",
      "You just rent space in it!",
      "GG? More like GTFO!",
      "Better luck never!",
    ],

    // MINIONS' CHAT MESSAGES
    [
      "Wanna have a punch salad?",
      "Want me to take you home, kid?",
      "Wait, I gotta pee!",
      "Don't hit me while I'm in the bathroom!",
      "Is this a fight or a dance class?",
      "Your punches feel like tickles!",
      "Time out! I lost my shoe!",
      "You fight like my grandma’s cat!",
      "I thought this was karaoke night!",
      "Hold on, my snack fell!",
      "No one fights well on an empty stomach!",
      "Did I win or just fall over?",
      "I think I broke my dignity!",
      "Is this the tutorial?",
      "Am I even in the right game?",
      "My weapon is... friendship!",
      "Just kidding, it’s a frying pan!",
    ],

    // JOSEPH'S CHAT MESSAGES
    [
      "You're all gonna die, freaks!",
      "I love the sound of fear in your voice",
      "Your screams are music to me",
      "You can run, but your soul stays here",
      "This isn’t a game. It’s a ritual",
      "I don't kill for fun... I kill for purpose",
      "One by one, you'll all beg",
      "The silence after a scream is beautiful",
      "Welcome to your nightmare, courtesy of me",
    ],
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
      contentMaxCharactersPerLine = 20;

      balloonWidth = 320;
      balloonHeight = 200;

      balloonXCoordinate += 20;
      balloonYCoordinate -= balloonHeight;

      contentXCoordinate = balloonXCoordinate + balloonWidth / 2;
      contentInitialYCoordinate = balloonYCoordinate + balloonHeight / 3.5;
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
