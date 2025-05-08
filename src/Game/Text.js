import globals from "./globals.js";

export default class Text {
  #contentAsString;
  #contentAsArray;
  #xCoordinate;
  #initialYCoordinate;

  constructor(
    contentAsString,
    contentAsArray,
    xCoordinate,
    initialYCoordinate
  ) {
    this.#contentAsString = contentAsString;
    this.#contentAsArray = contentAsArray;
    this.#xCoordinate = xCoordinate;
    this.#initialYCoordinate = initialYCoordinate;
  }

  static create(
    contentAsString,
    maxCharactersPerLine,
    xCoordinate,
    initialYCoordinate
  ) {
    const contentAsArray = [];

    let charactersCounter = 0;
    let lastWhitespaceIndex = -1;
    for (let i = 0; i < contentAsString.length; i++) {
      charactersCounter++;

      const currentCharacter = contentAsString[i];
      if (currentCharacter === " ") {
        lastWhitespaceIndex = i;
      }

      if (
        charactersCounter === maxCharactersPerLine ||
        i === contentAsString.length - 1
      ) {
        const lineFirstCharacterIndex = i + 1 - charactersCounter;
        let lineLastCharacterIndex = i + 1;

        const lastCharacter = contentAsString[i + 1];
        if (lastCharacter && lastCharacter !== " ") {
          lineLastCharacterIndex = lastWhitespaceIndex + 1;
          i = lastWhitespaceIndex;
        }

        const line = contentAsString
          .substring(lineFirstCharacterIndex, lineLastCharacterIndex)
          .trim();

        contentAsArray.push(line);

        charactersCounter = 0;
      }
    }

    const text = new Text(
      contentAsString,
      contentAsArray,
      xCoordinate,
      initialYCoordinate
    );

    return text;
  }

  render() {
    let currentLineYCoordinate = this.#initialYCoordinate;

    for (let i = 0; i < this.#contentAsArray.length; i++) {
      const currentLine = this.#contentAsArray[i];

      globals.ctx.fillText(
        currentLine,
        this.#xCoordinate,
        currentLineYCoordinate
      );

      currentLineYCoordinate += 20;
    }
  }

  getContentAsString() {
    return this.#contentAsString;
  }

  renderAnimated(visibleCharacters) {
    let currentLineYCoordinate = this.#initialYCoordinate;
    let charsToRender = visibleCharacters;

    for (let i = 0; i < this.#contentAsArray.length; i++) {
      const line = this.#contentAsArray[i];

      if (charsToRender <= 0) break;

      const charsInLine = Math.min(charsToRender, line.length);
      const partialLine = line.slice(0, charsInLine);

      globals.ctx.fillText(
        partialLine,
        this.#xCoordinate,
        currentLineYCoordinate
      );

      currentLineYCoordinate += 20;
      charsToRender -= charsInLine;
    }
  }
}
