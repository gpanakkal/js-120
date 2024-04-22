const constants = require('./constants.json');
const { GameRules } = require('./GameRules');
const { Match } = require('./Match');
/**
 * Game engine
  * Initialize game rules, then start a match
  * At the end of a match, prompt the user to play again
  * with the same rules
 */
class TicTacToeGame {
  constructor() {
    this.rules = new GameRules();
    this.scores = {};
  }

  play() {
    const match = new Match(this.rules);
    match.play();
  }

}

new TicTacToeGame.play();