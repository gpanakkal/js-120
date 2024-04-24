const { question } = require('readline-sync');
const constants = require('./constants.json');
const { Player } = require('./Player');

class HumanPlayer extends Player {
  static getValidInput(promptMsg, invalidInputMsgCb, testCallback) {
    console.log(`\n${promptMsg}`);
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

    const userInput = HumanPlayer.getValidInput(promptMsg, invalidInputMsgCb, inputValidator);

    return userInput.trim() === '' ? defaultValue : Number(userInput.trim());
  }

  /**
   * @returns A string between MinLength and maxLength inclusive,
   * or the default value if the user provides empty input
   */
  static getTextInput(minLength, maxLength, defaultValue, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim().length === 0;
    const isValidInput = (input) => (noInputPassed(input)
      || (input.length >= minLength && input.length <= maxLength));
    const userInput = HumanPlayer.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);
    return noInputPassed(userInput) ? defaultValue : userInput;
  }

  /**
   * @returns true if the user chose (y)es,
   * false if the user chose (n)o,
   * or the default value if the user provides empty input
   */
  static getBooleanInput({trueValue, falseValue, defaultValue}, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim().length === 0;
    const partialMatch = (input, value) => value.startsWith(input.toLowerCase());

    const isValidInput = (input) => (noInputPassed(input) || partialMatch(input, trueValue) || partialMatch(input, falseValue));

    const userInput = HumanPlayer.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);
    if (noInputPassed(userInput)) return defaultValue;
    else if (partialMatch(userInput, trueValue)) return true;
    else if (partialMatch(userInput, falseValue)) return false;
  }

  static isValidMove(validMoves, moveInput) {
    const {rowLabels, columnLabels} = HumanPlayer.getValidMoveLabels(validMoves);
    
    const rowRegex = new RegExp(`[${rowLabels.join('')}]`, 'i');
    const columnRegex = new RegExp(`[${columnLabels.join('')}]`, 'i');

    const chars = moveInput.replaceAll(/\s+/g, '').split('');
    const row = chars.filter((char) => rowRegex.test(char)).join('').toUpperCase();
    const column = chars.filter((char) => columnRegex.test(char)).join('').toUpperCase();

    const address = row + column;
    return validMoves.includes(address);
  }

  static getValidMoveLabels(validMoves) {
    return validMoves.reduce((outputObj, cellAddress) => {
      const [row, col] = cellAddress.split('');
      outputObj.rowLabels.push(row);
      outputObj.columnLabels.push(col);
      return outputObj;
    }, {rowLabels: [], columnLabels: []});
  }

  /**
   * Take a move consisting of a single number and letter,
   * in either order, ignoring spaces. Returns an object
   * of the parsed row and column labels
   */
  getMoveInput(validMoves, promptMsg, invalidInputMsgCb) {

    // const isValidMove = (input) => {
    // };

    const promptWithName = `${this.displayName()}: ${promptMsg}`;
    const userInput = HumanPlayer.getValidInput(promptWithName, invalidInputMsgCb, HumanPlayer.isValidMove.bind(this, validMoves));
    const inputChars = userInput.toUpperCase().split('');
    const { rowLabels, columnLabels } = HumanPlayer.getValidMoveLabels(validMoves);
    const rowLabel = inputChars.filter((char) => rowLabels.includes(char));
    const columnLabel = inputChars.filter((char) => columnLabels.includes(char));
    const cellAddress = rowLabel + columnLabel;
    return this.getFormattedMove(cellAddress);
  }
}

module.exports = { HumanPlayer };
