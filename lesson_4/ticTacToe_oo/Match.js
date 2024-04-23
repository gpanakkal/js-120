const { Board } = require('./Board');
const { ComputerPlayer } = require('./ComputerPlayer');
const constants = require('./constants.json');

/**
 * Given a set of game rules, initialize and manage a match
 * Get player moves and assign them to the board
 * Determine when the game has ended and display the result
 */
class Match {

  constructor(rules) {
    this.board = new Board(rules.boardLength, rules.winningLineLength);
    this.players = rules.players;
    this.winner = null;
  }

  /**
   * Determine a turn order,
   * then execute player turns, checking if the game is ended
   * after each player plays
   */
  play() {
    this.randomizeTurnOrder();
    const getNextIndex = (current) => (current + 1 >= this.players.length ? 0 : current + 1);
    let index = 0;

    while (!this.gameIsOver) {
      const currentPlayer = this.players[index];
      console.log(`${currentPlayer.displayName()}'s turn`);
      if (currentPlayer instanceof ComputerPlayer) {
        this.board.state = currentPlayer.makeMove();
      } else {
        this.board.state = this.getHumanMove(currentPlayer);
      }
      index = getNextIndex(index);
    }

    this.setWinner();
    return { winner: this.setWinner, playAgain: this.promptPlayAgain() };
  }

  getHumanMove(player) {
    const validMoves = this.board.getEmptyCellEntries();
    const invalidMoveMsgCb = (input) => `${input} is invalid. Available cells: ${validMoves.join(', ')}`;
    return player.getMoveInput(this.board, constants.HUMAN_PLAY_TURN_PROMPT, invalidMoveMsgCb);
  }

  randomizeTurnOrder() {
    this.players.sort(() => Math.random() - Math.random());
  }

  gameIsOver() {
    return this.board.isFull() || this.board.winningShape();
  }

  setWinner() {
    // if the game is over but there is no winning shape
    this.winner = this.board.winningShape();
  }

  promptPlayAgain() {
    const promptMsg = constants.PLAY_AGAIN_PROMPT;
    const userInput = this.players[0].getBooleanInput('n', promptMsg).trim().toLowerCase().slice[0];
    return userInput === 'y';
  }
}

module.exports = { Match };
