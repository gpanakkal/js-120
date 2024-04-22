const { Board } = require("./Board");

/**
 * Given a set of game rules, initialize and manage a match
 * Get player moves and assign them to the board
 * Determine when the game has ended and display the result
 */
class Match {
  constructor(rules) {
    this.board = new Board(rules.boardLength, rules.winningLineLength);
    this.players = rules.players;
  }

  /**
   * Determine a turn order,
   * then execute player turns, checking if the game is ended
   * after each player plays
   */
  play() {
    this.randomizeTurnOrder();
    const getNextIndex = (current) => current + 1 >= this.players.length ? 0 : current + 1;
  }

  randomizeTurnOrder() {
    this.players.sort((a, b) => Math.random() - Math.random());
  }

  gameOver() {

  }
}

module.exports = { Match };