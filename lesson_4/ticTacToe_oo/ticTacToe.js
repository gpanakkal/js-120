const constants = require('./constants.json');
const { GameRules } = require('./GameRules');
const { Match } = require('./Match');
const { ScoreBoard } = require('./ScoreBoard');
const { HumanPlayer } = require('./HumanPlayer');
const { Renderer } = require('./Renderer');

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
      const renderer = new Renderer(match, this.scoreBoard);
      match.initializeRenderer(renderer);
      match.play();
      this.scoreBoard.addWin(match.winner);
      match.renderer.display();
      const playAgain = TicTacToeGame.promptPlayAgain();
      if (!playAgain) break;
    }
  }

  static promptPlayAgain() {
    const promptMsg = constants.PLAY_AGAIN_PROMPT;
    const values = { trueValue: 'yes', falseValue: 'no', defaultValue: false };
    const userInput = HumanPlayer.getBooleanInput(values, promptMsg);
    return userInput;
  }
}

const game = new TicTacToeGame();
game.play();
