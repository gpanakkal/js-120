/* eslint-disable no-console */
class Round {
  constructor(human, computer) {
    this.human = human;
    this.computer = computer;
    this.movesPlayed = { human: null, computer: null };
    this.result = 'undecided';
  }

  play() {
    this.movesPlayed.human = this.human.promptMove();
    this.movesPlayed.computer = this.computer.randomMove();
  }

  calcResult(rules) {
    this.result = rules.calcResult(...Object.values(this.movesPlayed));
  }

  displayResult() {
    let resultStr = 'Round was a draw.';
    const winnerStr = (winner) => `${winner} won the round.`;
    if (this.result === 'human') {
      resultStr = winnerStr(this.human.name);
    } else if (this.result === 'computer') {
      resultStr = winnerStr(this.computer.name);
    }

    const humanMoveStr = `${this.human.name} played ${this.movesPlayed.human}`;
    const computerMoveStr = `${this.computer.name} played ${this.movesPlayed.computer}`;

    console.log(`${humanMoveStr}. ${computerMoveStr}. ${resultStr}`);
  }
}

module.exports = { Round };
