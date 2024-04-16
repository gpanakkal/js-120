/* eslint-disable no-console */
const { createMatch } = require('./Match');
const { createHumanPlayer, createComputer } = require('./Player');

function createRules(moveOptions = ['rock', 'paper', 'scissors']) {
  const moveBeats = moveOptions.reduce((obj, current, idx, arr) => {
    const loopedPrevIndex = idx === 0 ? arr.length - 1 : idx - 1;
    const previousElement = moveOptions[loopedPrevIndex];
    const rule = { [current]: previousElement };
    return Object.assign(obj, rule);
  }, {});

  return {
    moveOptions,
    moveBeats,

    calcResult(humanMove, computerMove) {
      if (humanMove === computerMove) return 'draw';
      if (moveBeats[humanMove] === computerMove) return 'human';
      if (moveBeats[computerMove] === humanMove) return 'computer';
      throw new Error('error calculating result');
    },
  };
}

function createRPSGame(rules) {
  return {
    rules,
    human: createHumanPlayer('human', rules.moveOptions),
    computer: createComputer('computer', rules.moveOptions),
    match: undefined,
    welcomeMessage: 'Welcome to Rock Paper Scissors',
    goodbyeMessage: 'Thanks for playing Rock Paper Scissors. Goodbye!',

    play() {
      this.initGame();
      do {
        this.match = createMatch(this.human, this.computer, this.rules);
        this.match.play();
      } while (this.human.promptPlayAgain() === true);
    },

    initGame() {
      this.displayWelcomeMessage();
      this.human.promptPlayerName();
    },

    displayWelcomeMessage() {
      console.log(this.welcomeMessage);
    },

    displayGoodbyeMessage() {
      console.log(this.goodbyeMessage);
    },
  };
}

const RPSGame = createRPSGame(createRules());
RPSGame.play();
