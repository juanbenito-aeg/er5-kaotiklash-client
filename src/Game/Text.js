export default class Text {
  #contentAsArray;
  #xCoordinate;
  #initialYCoordinate;

  constructor(contentAsArray, xCoordinate, initialYCoordinate) {
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
    for (let i = 0; i < contentAsString.length; i++) {
      charactersCounter++;

      if (
        charactersCounter === maxCharactersPerLine /*  ||
        i > contentAsString.length - maxCharactersPerLine */
      ) {
        let line = contentAsString.substring(i + 1 - charactersCounter, i);

        const previousCharacter = contentAsString[i - 1];
        const currentCharacter = contentAsString[i];
        if (previousCharacter !== " " && currentCharacter !== " ") {
          line = line.substring(0, maxCharactersPerLine - 1) + "-";
          i--;
        } else if (previousCharacter === " " && currentCharacter !== " ") {
          line = line.substring(0, maxCharactersPerLine - 1);
          i--;
        }

        contentAsArray.push(line);

        charactersCounter = 0;
      }
    }

    const text = new Text(contentAsArray, xCoordinate, initialYCoordinate);

    return text;
  }
}
