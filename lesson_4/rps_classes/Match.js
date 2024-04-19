/* eslint-disable no-console */
const { Round } = require('./Round');

class Match {
  constructor(human, computer, rules) {
    this.human = human;
    this.computer = computer;
    this.rules = rules;
    this.roundsTotal = 1;
    this.rounds = [];
    this.score = { human: 0, computer: 0, draw: 0 };
    this.result = 'Match ongoing';
    this.paddingString = '-'.repeat(5);
  }

  play() {
    this.roundsTotal = this.human.promptRoundTotal();
    this.updateMatchDisplay();
    while (!this.gameOver()) {
      const round = new Round(this.human, this.computer);
      this.rounds.push(round);
      round.play();
      round.calcResult(this.rules);
      this.updateScore(round.result);
      this.updateMatchDisplay();
      // round.displayResult(this.human.name, this.computer.name);
      if (!this.gameOver()) this.displayScore();
    }
    this.calcResult();
    this.displayResult();
  }

  displayMatchStartMessage() {
    const message = `NEW BEST-OF-${this.roundsTotal} MATCH STARTED`;
    console.log(`${this.paddingString}${message}${this.paddingString}`);
  }

  updateMatchDisplay() {
    console.clear();
    this.displayMatchStartMessage();
    this.rounds.forEach(round => round.displayResult(this.human.name, this.computer.name));
  }

  roundsPlayed() {
    const roundsPlayed = Object.entries(this.score).reduce((sum, current) => current[1] + sum, 0);
    return roundsPlayed;
  }

  updateScore(roundResult) {
    const isValidResult = Object.keys(this.score).includes(roundResult);
    if (!isValidResult) {
      console.log(`matchScore.update: Result ${isValidResult} is invalid`);
      return;
    }
    this.score[roundResult] += 1;
  }

  getScore() {
    const { human: humanScore, computer: computerScore, draw: drawNum } = this.score;
    return `${this.human.name}: ${humanScore}, ${this.computer.name}: ${computerScore}, draws: ${drawNum}`;
  }

  displayScore() {
    const roundsPlayedStr = `${this.roundsPlayed()} of ${this.roundsTotal} rounds played.`;
    const header = `\n${this.paddingString}SCORE${this.paddingString}`;
    const footer = `${this.paddingString[0].repeat(header.length)}`;
    console.log(header);
    console.log(`${this.getScore()}. ${roundsPlayedStr}`);
    console.log(footer);
  }

  gameOver() {
    const { human: humanScore, computer: computerScore, draw: drawNum } = this.score;
    const maxNonDrawRounds = this.roundsTotal - drawNum;
    const victoryRoundTarget = Math.floor(maxNonDrawRounds / 2) + 1;
    const gameWon = Math.max(humanScore, computerScore) >= victoryRoundTarget;
    return gameWon || this.roundsPlayed() >= this.roundsTotal;
  }

  calcResult() {
    const diff = this.score.human - this.score.computer;
    let result = 'draw';
    if (diff > 0) result = 'human';
    else if (diff < 0) result = 'computer';
    this.result = result;
  }

  displayResult() {
    const header = `\n${this.paddingString}FINAL SCORE${this.paddingString}`;
    const footer = this.paddingString[0].repeat(header.length);
    const scoreStr = `${this.getScore()}`;
    const outcomeStr = this.result === 'draw'
      ? 'Match ended in a draw!'
      : `Match ended with ${this[this.result].name} winning!`;
    console.log(header);
    console.log(`${scoreStr}. ${outcomeStr}`);
    console.log(footer);
  }
}

module.exports = { Match };
