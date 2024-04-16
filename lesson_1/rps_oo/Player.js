/* eslint-disable no-console */
const { question } = require('readline-sync');

function createPlayer(name, moveOptions) {
  return {
    name,
    moveOptions,
  };
}

function createHumanPlayer(name, moveOptions) {
  return Object.assign(createPlayer(name, moveOptions), {
    roundMaxPrompt: 'Enter the number of rounds to score out of (1 by default): ',
    playAgainPrompt: 'Play again? y / n: ',
    getInvalidInputMsg: (input) => `Input ${input} is invalid`,

    namePrompt() {
      return `Provide your name ("${this.name}" by default): `;
    },

    movePrompt() {
      return `Select one of ${this.moveOptions.join(', ')}: `;
    },

    promptRoundTotal() {
      const isValidNum = (input) => !Number.isNaN(Number(input));
      const roundTotal = Number(this.getValidInput(
        this.roundMaxPrompt,
        question,
        this.getInvalidInputMsg,
        isValidNum,
      ));
      return roundTotal;
    },

    promptPlayerName() {
      const newName = this.getValidInput(
        this.namePrompt(),
        question,
        this.getInvalidInputMsg,
        () => true,
      );
      if (newName.trim() === '') return;
      this.name = newName;
    },

    promptMove() {
      const isValidMove = (move) => moveOptions.includes(move);
      return this.getValidInput(this.movePrompt(), question, this.getInvalidInputMsg, isValidMove);
    },

    promptPlayAgain() {
      const isValidResp = (input) => ['y', 'n'].includes(input.toLowerCase());
      const response = this.getValidInput(
        this.playAgainPrompt,
        question,
        this.getInvalidInputMsg,
        isValidResp,
      ).toLowerCase();
      return response === 'y';
    },

    getValidInput(prompt, inputCallback, errorMsgCallback, testingCallback) {
      let userInput = inputCallback(prompt);
      while (!testingCallback(userInput)) {
        console.log(errorMsgCallback(userInput));
        userInput = inputCallback(prompt);
      }
      return userInput;
    },
  });
}

function createComputer(name, moveOptions) {
  return Object.assign(createPlayer(name, moveOptions), {
    randomMove() {
      const randomNum = Math.floor(Math.random() * this.moveOptions.length);
      return moveOptions[randomNum];
    },
  });
}

module.exports = { createHumanPlayer, createComputer };
