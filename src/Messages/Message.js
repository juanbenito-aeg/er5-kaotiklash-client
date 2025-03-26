export default class Message {
  static #messages = {
    ENG: [], //ENGLISH MESSAGES
    EUS: [], //BASQUE MESSAGES
  };
  static create(type, content, duration) {
    const message = new Message(type, content, duration);
    this.#messages[type].push(message);
    return message;
  }

  execute() {}

  static getMessages(language = "ENG") {
    return this.#messages[language];
  }
}
