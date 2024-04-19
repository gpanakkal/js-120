/* eslint-disable no-console */
const { GameRules } = require('./GameRules');
const { Match } = require('./Match');
const { Human, Computer } = require('./Player');

class RPSGame {
  constructor(rules) {
    this.rules = rules;
    this.human = new Human('human', rules.moveOptions);
    this.computer = new Computer('computer', rules.moveOptions);
    this.match = undefined;
    this.welcomeMessage = 'Welcome to Rock Paper Scissors';
    this.goodbyeMessage = 'Thanks for playing Rock Paper Scissors. Goodbye!';
  }

  play() {
    this.initGame();
    do {
      this.match = new Match(this.human, this.computer, this.rules);
      this.match.play();
    } while (this.human.promptPlayAgain() === true);
    this.displayGoodbyeMessage();
  }

  initGame() {
    console.clear();
    this.displayWelcomeMessage();
    this.human.promptPlayerName();
  }

  displayWelcomeMessage() {
    console.log(this.welcomeMessage);
  }

  displayGoodbyeMessage() {
    console.log(this.goodbyeMessage);
  }

}

const rules = new GameRules();
const game = new RPSGame(rules);
game.play();
