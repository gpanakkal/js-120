

const { question } = require('readline-sync');

function createRPSGame(rules) {
  return {
    rules,
    human: createPlayer('human', rules.moveOptions),
    computer: createPlayer('computer', rules.moveOptions, false),
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
  }
}

function createMatch(human, computer, rules) {
  return {
    human,
    computer,
    rules,
    roundsTotal: 1,
    rounds: [],
    score: createMatchScore(),
    result: 'Match ongoing',

    play() {
      this.roundsTotal = Math.max(1, this.human.promptRoundTotal());
      while (!this.gameWon()) {
        const round = createRound(this.human, this.computer);
        this.rounds.push(round);
        round.play();
        // console.log({rules: this.rules})
        round.calcResult(this.rules.calcResult);
        this.score.update(round.result);
        round.displayResult(human.name, computer.name);
      }
      this.setResult();
      this.displayResult();
    },

    roundsPlayed() {
      const scoreKeys = this.score.getScore();
      const roundsPlayed = Object.entries(scoreKeys).reduce((sum, current) => current[1] + sum, 0);
      return roundsPlayed;
    },
    
    gameWon() {
      const {human, computer, draw} = this.score.getScore();
      const maxNonDrawRounds = this.roundsTotal - draw;
      const victoryRoundTarget = Math.floor(maxNonDrawRounds / 2) + 1;
      const gameWon = Math.max(human, computer) >= victoryRoundTarget;
      return gameWon;
    },

    setResult() {
      const diff = this.score.human - this.score.computer;
      let result = 'draw';
      if (diff > 0) result = 'human';
      else if (diff < 0) result = 'computer';
      this.result = result;
    },

    displayResult() {
      const scoreStr = `Final score: ${this.score.human}:${this.score.computer}:${this.score.draw}`;
      const outcomeStr = this.result === 'draw' 
        ? 'Match ended in a draw!'
        : `Match ended with ${this[this.result].name} winning!`;

      console.log(`${scoreStr}. ${outcomeStr}`);
    },
  }
}

function createMatchScore(human = 0, computer = 0, draw = 0) {
  return {
    human,
    computer,
    draw,

    getScore() {
      return {
        human: this.human, 
        computer: this.computer, 
        draw: this.draw
      };
    },

    update(roundResult) {
      const isValidResult = Object.keys(this.getScore()).includes(roundResult);
      if (!isValidResult) {
        console.log(`matchScore.update: Result ${isValidResult} is invalid`);
        return;
      }
      this[roundResult] += 1;
      // console.log({roundResult, score: this.getScore(), resultScore: this[roundResult]})
    },

    display(humanName, computerName) {
      return `Score: ${humanName}: ${this.human}, ${computerName}: ${this.computer}, draws: ${this.draw}`;
    }
  }
}

function createRound(human, computer) {
  return {
    human,
    computer,
    movesPlayed: [],
    result: 'undecided',

    play() {
      const humanMove = this.human.promptHumanMove();
      const computerMove = this.computer.randomMove();
      this.movesPlayed = [humanMove, computerMove];
    },

    calcResult(rule) {
      this.result = rule(...this.movesPlayed);
    },

    displayResult(humanName, computerName) {
      let resultStr = 'Round was a draw.';
      const winnerStr = (winner) => `${winner} won the round.`
      if (this.result === 'human') {
        resultStr = winnerStr(humanName);
      } else if (this.result === 'computer') {
        resultStr = winnerStr(computerName);
      }

      const humanMoveStr = `${humanName} played ${this.movesPlayed[0]}`;
      const computerMoveStr = `${computerName} played ${this.movesPlayed[1]}`;

      console.log(`${humanMoveStr}. ${computerMoveStr}. ${resultStr}`);
    },
  }

}

function createPlayer(name, moveOptions, isHuman = false) {
  return {
    name,
    moveOptions,
    isHuman,
    roundMaxPrompt: 'Enter the number of rounds to score out of (1 by default): ',
    playAgainPrompt: `Play again? y / n: `,
    getInvalidInputMsg: (input) => `Input ${input} is invalid`,
    
    namePrompt() {
      return `Provide your name ("${this.name}" by default): `;
    },
    
    movePrompt() {
      return `Select one of ${this.moveOptions.join(', ')}: `;
    },

    promptRoundTotal() {
      const isValidNum = (input) => !Number.isNaN(Number(input));
      const roundTotal = Number(this.getValidInput(this.roundMaxPrompt, question, this.getInvalidInputMsg, isValidNum));
      return roundTotal;
    },
    
    promptPlayerName() {
      const newName = this.getValidInput(this.namePrompt(), question, this.getInvalidInputMsg, () => true);
      if (newName.trim() === '') return;
      this.name = newName;
    },

    promptHumanMove() {
      const isValidMove = (move) => moveOptions.includes(move);
      return this.getValidInput(this.movePrompt(), question, this.getInvalidInputMsg, isValidMove);
    },

    promptPlayAgain() {
      const isValidResp = (input) => ['y', 'n'].includes(input.toLowerCase());
      const response = this.getValidInput(this.playAgainPrompt, question, this.getInvalidInputMsg, isValidResp).toLowerCase();
      return response === 'y';
    },

    randomMove() {
      const randomNum = Math.floor(Math.random() * this.moveOptions.length);
      return moveOptions[randomNum];
    },

    getValidInput(prompt, inputCallback, errorMsgCallback, testingCallback) {
      let userInput = inputCallback(prompt);
      while (!testingCallback(userInput)) {
        console.log(errorMsgCallback(userInput));
        userInput = inputCallback(prompt);
      }
      return userInput;
    },
  }
}

function createRules() {
  const moveOptions = ['rock', 'paper', 'scissors'];
  const moveBeats = moveOptions.reduce((obj, current, idx, arr) => {
    const loopedPrevIndex = idx === 0 ? arr.length - 1 : idx - 1;
    const previousElement = moveOptions[loopedPrevIndex];
    const rule = {[current]: previousElement};
    return Object.assign(obj, rule);
  }, {});

  return {
    moveOptions,
    moveBeats,

    calcResult(humanMove, computerMove) {
      if (humanMove === computerMove) return 'draw';
      if (moveBeats[humanMove] === computerMove) return 'human';
      if (moveBeats[computerMove] === humanMove) return 'computer';
      else throw new Error('error calculating result');
    }
  };
}

const RPSGame = createRPSGame(createRules());
RPSGame.play();