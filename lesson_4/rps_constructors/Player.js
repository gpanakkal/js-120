/* eslint-disable no-console */
const { question } = require('readline-sync');

function Player(name, moveOptions) {
  this.name = name;
  this.moveOptions = moveOptions;
}

function Human(name, moveOptions) {
  Player.call(this, name, moveOptions);
  this.roundMaxPrompt = '\nEnter the number of rounds to score out of (1 by default; 1 minimum): ';
  this.playAgainPrompt = 'Play again? y / n: ';
}

Human.prototype = Object.create(Player.prototype);
Object.assign(Human.prototype, {
  constructor: Human,
  
  getInvalidInputMsg: (input) => `Input ${input} is invalid`,

  namePrompt() {
    return `Provide your name ("${this.name}" by default): `;
  },

  movePrompt() {
    const formatMove = (move) => `(${move[0]})${move.slice(1)}`;
    const formattedMoves = this.moveOptions.map(formatMove);
    return `Select one of ${formattedMoves.join(', ')}: `;
  },

  promptRoundTotal() {
    const isValidNum = (input) => !Number.isNaN(Number(input));
    const roundTotal = Number(this.getValidInput(
      this.roundMaxPrompt,
      question,
      this.getInvalidInputMsg,
      isValidNum,
    ));
    return Math.max(1, roundTotal);
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
    const matchingMoves = (move) => this.moveOptions.filter((option) => option.startsWith(move));
    const isValidMove = (move) => (matchingMoves(move).length === 1);
    const response = this.getValidInput(this.movePrompt(), question, this.getInvalidInputMsg, isValidMove);
    return matchingMoves(response)[0];
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

function Computer(name, moveOptions) {
  Player.call(this, name, moveOptions);
}

Computer.prototype = Object.create(Player.prototype);
Object.assign(Computer.prototype, {
  constructor: Computer,

  randomMove() {
    const randomNum = Math.floor(Math.random() * this.moveOptions.length);
    return this.moveOptions[randomNum];
  },
});

module.exports = { Human, Computer };
