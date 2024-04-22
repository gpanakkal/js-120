const { question } = require('readline-sync');
/**
 * 
 */
class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
  }

  displayName() {
    return `${this.name} (${this.marker})`;
  }
}

class computerPlayer extends Player {
  
  makeMove() {
    // if there is a winning move, make it
    // else if an opponent has a winning move, block it
    // else if the center is available, fill it
    // else fill a random cell
  }
}

class humanPlayer extends Player {
  getValidInput(promptMsg, invalidInputMsgCb, testCallback) {
    console.log(promptMsg);
    let userInput = question(constants.INPUT_PROMPT);
    while (!testCallback(userInput)) {
      const invalidInputMsg = invalidInputMsgCb ? invalidInputMsgCb(userInput) 
        : `Input ${userInput} is invalid`;
      console.log(invalidInputMsg);
      console.log(promptMsg);
      userInput = question(promptMsg);
    }
    return userInput;
  }

  getNumberInput(min, max, defaultValue, promptMsg, invalidInputMsgCb) {
    
    const inputValidator = (input) => {
      const isWithinBounds = Number(input) >= min && Number(input) <= max;
      const noValuePassed = String(input).trim() === '';
      return isWithinBounds || noValuePassed;
    };

    const userInput = this.getValidInput(promptMsg, invalidInputMsgCb, inputValidator);

    return userInput.trim() === '' ? defaultValue : Number(userInput.trim());
  }
  /**
   * 
   * @returns A string between MinLength and maxLength inclusive,
   * or the default value if the user provides empty input
   */
  getTextInput(minLength, maxLength, defaultValue, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim.length === 0;
    const isValidInput = (input) => (noInputPassed(input) || (input.length >= minLength && input.length <= maxLength));
    const userInput = this.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);
    return noInputPassed(userInput) ? defaultValue : userInput;
  }

  /**
   * 
   * @returns true if the user chose (y)es,
   * false if the user chose (n)o,
   * or the default value if the user provides empty input
   */
  getBooleanInput(defaultValue, promptMsg, invalidInputMsgCb) {
    const noInputPassed = (input) => input.trim.length === 0;
    const partialMatch = (input, value) => value.startsWith(input.toLowerCase()); 
    
    const isValidInput = (input) => (noInputPassed(input) || partialMatch(input, 'yes') || partialMatch(input, 'no'));

    const userInput = this.getValidInput(promptMsg, invalidInputMsgCb, isValidInput);

    return noInputPassed(userInput) ? defaultValue : userInput;
  }

  /**
   * Take a move consisting of a single number and letter,
   * in either order, ignoring spaces. Returns an object
   * of the parsed row and column labels
   */
  getMoveInput(board, promptMsg, invalidInputMsgCb) {
    const firstRow = Object.values(board.state)[0];
    const validRowLabels = Object.keys(board.state);
    const validColumnLabels = Object.keys(firstRow);

    const letterNumberPattern = new RegExp(`^[${validColumnLabels.join('')}][${validRowLabels.join('')}]$`, 'i');
    const numberLetterPattern = new RegExp(`^[${validRowLabels.join('')}][${validColumnLabels.join('')}]$`, 'i');

  const isValidMove = (input) => letterNumberPattern.test(input.replaceAll(/\s/g, '')) 
    || numberLetterPattern.test(input.replaceAll(/\s/g, ''));

    const userInput =  this.getValidInput(promptMsg, invalidInputMsgCb, isValidMove);
    const inputChars = userInput.toUpperCase().split('');
    const rowLabel = inputChars.filter(char => validRowLabels.includes(char));
    const columnLabel = inputChars.filter(char => validColumnLabels.includes(char));
    return { row: rowLabel, col: columnLabel };
  }
}

module.exports = { computerPlayer, humanPlayer };
