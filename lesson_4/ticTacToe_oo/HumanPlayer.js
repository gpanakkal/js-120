const { question } = require('readline-sync');
const constants = require('./constants.json');
const { Player } = require('./Player');

class HumanPlayer extends Player {
  static getValidInput(promptMsg, invalidInputMsgCb, testCallback) {
    console.log(promptMsg);
    let userInput = question(constants.INPUT_PROMPT_PREFIX);
    while (!testCallback(userInput)) {
      const invalidInputMsg = invalidInputMsgCb ? invalidInputMsgCb(userInput)
        : `Input ${userInput} is invalid`;
      console.log(invalidInputMsg);
      console.log(promptMsg);
      userInput = question(constants.INPUT_PROMPT_PREFIX);
    }
    return userInput;
  }

  static getNumberInput(min, max, defaultValue, promptMsg, invalidInputMsgCb) {
    const inputValidator = (input) => {
      const isWithinBounds = Number(input) >= min && Number(input) <= max;
      const noValuePassed = String(input).trim() === '';
      return isWithinBounds || noValuePassed;
    };

    const userInput = Player.getValidInput(promptMsg, invalidInputMsgCb, inputValidator);

    return userInput.trim() === '' ? defaultValue : Number(userInput.trim());
  }

  /**
   * @returns A string between MinLength and maxLength inclusive,
   * or the default value if the user provides empty input
   */
  static getTextInput(minLength, maxLength, defaultValue, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim.length === 0;
    const isValidInput = (input) => (noInputPassed(input)
      || (input.length >= minLength && input.length <= maxLength));
    const userInput = Player.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);
    return noInputPassed(userInput) ? defaultValue : userInput;
  }

  /**
   * @returns true if the user chose (y)es,
   * false if the user chose (n)o,
   * or the default value if the user provides empty input
   */
  static getBooleanInput(defaultValue, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim.length === 0;
    const partialMatch = (input, value) => value.startsWith(input.toLowerCase());

    const isValidInput = (input) => (noInputPassed(input) || partialMatch(input, 'yes') || partialMatch(input, 'no'));

    const userInput = Player.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);

    return noInputPassed(userInput) ? defaultValue : userInput;
  }

  /**
   * Take a move consisting of a single number and letter,
   * in either order, ignoring spaces. Returns an object
   * of the parsed row and column labels
   */
  static getMoveInput(board, promptMsg, invalidInputMsgCb) {
    const { rowLabels, columnLabels } = board.labels;
    const validCells = board.getEmptyCells();

    const isValidMove = (input) => {
      const columnRegex = new RegExp(`[${columnLabels.join('')}]`, 'i');
      const rowRegex = new RegExp(`[${rowLabels.join('')}]`, 'i');

      const chars = input.replaceAll(/\s+/g, '').split('');
      const column = chars.filter((char) => columnRegex.test(char)).toUpperCase();
      const row = chars.filter((char) => rowRegex.test(char)).toUpperCase();

      const address = row + column;
      return validCells.includes(address);
    };

    const userInput = Player.getValidInput(promptMsg, invalidInputMsgCb, isValidMove);
    const inputChars = userInput.toUpperCase().split('');
    const rowLabel = inputChars.filter((char) => rowLabels.includes(char));
    const columnLabel = inputChars.filter((char) => columnLabels.includes(char));
    return { row: rowLabel, col: columnLabel };
  }
}

module.exports = { HumanPlayer };
