const { GameRules } = require('./GameRules');
const { Match } = require('./Match');
const { ScoreBoard } = require('./ScoreBoard');
/**
 * Game engine
  * Initialize game rules, then start a match
  * At the end of a match, prompt the user to play again
  * with the same rules
 */
class TicTacToeGame {
  constructor() {
    this.rules = new GameRules();
    this.scoreBoard = new ScoreBoard(this.rules.players);
  }

  play() {
    while (true) {
      const match = new Match(this.rules);
      const { winner, playAgain } = match.play();
      this.scoreBoard.addWin(winner);
      if (!playAgain) break;
    }
  }
}

const game = new TicTacToeGame();
game.play();
