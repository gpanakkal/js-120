/* eslint-disable no-console */
function createRound(human, computer) {
  return {
    human,
    computer,
    movesPlayed: [],
    result: 'undecided',

    play() {
      const humanMove = this.human.promptMove();
      const computerMove = this.computer.randomMove();
      this.movesPlayed = [humanMove, computerMove];
    },

    calcResult(rule) {
      this.result = rule(...this.movesPlayed);
    },

    displayResult(humanName, computerName) {
      let resultStr = 'Round was a draw.';
      const winnerStr = (winner) => `${winner} won the round.`;
      if (this.result === 'human') {
        resultStr = winnerStr(humanName);
      } else if (this.result === 'computer') {
        resultStr = winnerStr(computerName);
      }

      const humanMoveStr = `${humanName} played ${this.movesPlayed[0]}`;
      const computerMoveStr = `${computerName} played ${this.movesPlayed[1]}`;

      console.log(`${humanMoveStr}. ${computerMoveStr}. ${resultStr}`);
    },
  };
}

module.exports = { createRound };
