const { question } = require('readline-sync');
/**
 * 
 */
class Player {
  constructor(name) {
    this.name = name;
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
}

module.exports = { computerPlayer, humanPlayer };
