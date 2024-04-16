/* eslint-disable no-console */
const { createRound } = require('./Round');

function createMatch(human, computer, rules) {
  return {
    human,
    computer,
    rules,
    roundsTotal: 1,
    rounds: [],
    score: { human: 0, computer: 0, draw: 0 },
    result: 'Match ongoing',

    play() {
      this.roundsTotal = Math.max(1, this.human.promptRoundTotal());
      while (!this.gameOver()) {
        const round = createRound(this.human, this.computer);
        this.rounds.push(round);
        round.play();
        round.calcResult(this.rules.calcResult);
        this.updateScore(round.result);
        round.displayResult(human.name, computer.name);
      }
      this.calcResult();
      this.displayResult();
    },

    roundsPlayed() {
      const roundsPlayed = Object.entries(this.score).reduce((sum, current) => current[1] + sum, 0);
      return roundsPlayed;
    },

    updateScore(roundResult) {
      const isValidResult = Object.keys(this.score).includes(roundResult);
      if (!isValidResult) {
        console.log(`matchScore.update: Result ${isValidResult} is invalid`);
        return;
      }
      this.score[roundResult] += 1;
    },

    displayScore(humanName, computerName) {
      return `Score: ${humanName}: ${this.human}, ${computerName}: ${this.computer}, draws: ${this.draw}`;
    },

    gameOver() {
      const { human: humanScore, computer: computerScore, draw: drawNum } = this.score;
      const maxNonDrawRounds = this.roundsTotal - drawNum;
      const victoryRoundTarget = Math.floor(maxNonDrawRounds / 2) + 1;
      const gameWon = Math.max(humanScore, computerScore) >= victoryRoundTarget;
      return gameWon || this.roundsPlayed() >= this.roundsTotal;
    },

    calcResult() {
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
  };
}

module.exports = { createMatch };
