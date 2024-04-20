const { question } = require('readline-sync');
/**
 * 
 */
class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
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
  getValidInput(promptMsg, invalidInputMsg, testCallback) {
    let userInput = question(promptMsg);
    while (!testCallback(userInput)) {
      const invalid = invalidInputMsg 
        ? invalidInputMsg(userInput) 
        : `Input ${userInput} is invalid`;
      console.log(invalid);
      userInput = question(promptMsg);
    }
    return userInput;
  }

  getNumberInput(min, max, defaultValue, promptMsg, invalidInputMsg) {
    
    const inputValidator = (input) => {
      const isWithinBounds = Number(input) >= min && Number(input) <= max;
      const noValuePassed = String(input).trim() === '';
      return isWithinBounds || noValuePassed;
    };

    const userInput = this.getValidInput(promptMsg, invalidInputMsg, inputValidator);

    return userInput.trim() === '' ? defaultValue : Number(userInput.trim());
  }

  getMoveInput(promptMsg, invalidInputMsg, ) {
    
  }
}

module.exports = { computerPlayer, humanPlayer };
