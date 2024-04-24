const constants = require('./constants.json');
const { GameBoard } = require('./GameBoard');
const { ComputerPlayer } = require('./ComputerPlayer');

/**
 * Given a set of game rules, initialize and manage a match
 * Get player moves and assign them to the board
 * Determine when the game has ended and display the result
 */
class Match {
  constructor(rules) {
    this.board = new GameBoard(rules.boardLength, rules.winningLineLength);
    this.players = rules.players;
    this.winner = null;
    this.actions = [];
  }

  initializeRenderer(renderer) {
    this.renderer = renderer;
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

    console.log('----STARTING MATCH-----\n');
    this.renderer.display();

    while (!this.gameIsOver()) {
      const currentPlayer = this.players[index];
      this.playTurn(currentPlayer);
      this.renderer.display();
      index = getNextIndex(index);
    }

    this.setWinner();
  }
  
    randomizeTurnOrder() {
      this.players.sort(() => Math.random() - Math.random());
      console.log({ turnOrder: this.players.map((player) => player.displayName()) });
    }

  playTurn(currentPlayer) {
    console.log(`${currentPlayer.displayName()}'s turn`);
    const isComputer = currentPlayer instanceof ComputerPlayer;
    let move = isComputer ? currentPlayer.makeMove(this.board, this.players) 
      : this.getHumanMove(currentPlayer);
    this.board.state = move;
    this.logAction(currentPlayer, move);
  }

  logAction(player, move) {
    const { row, col, val } = move;
    this.actions.push({ player, moveAddress: row + col });
  }
  
  getActionDisplayLines() {
    return this.actions.map(({player, moveAddress}) => `${player.displayName()}: ${moveAddress}`);
  }
  
  getHumanMove(currentPlayer) {
    const validMoves = this.board.getEmptyCellNames();
    const invalidMoveMsgCb = (input) => `${input} is invalid. Available cells: ${validMoves.join(', ')}`;
    return currentPlayer.getMoveInput(
      this.board.getEmptyCellNames(),
      constants.HUMAN_PLAY_TURN_PROMPT,
      invalidMoveMsgCb,
    );
  }

  gameIsOver() {
    return this.board.isFull() || this.board.winningMarker();
  }

  getTitleDisplayLine() {
    let matchStatus = this.winner === null ? 'ongoing' : 'over';
    return `MATCH ${matchStatus.toUpperCase()}`;
  }

  #winningPlayerFromMarker(marker) {
    return this.players.filter((player) => player.marker === marker)[0];
  }

  setWinner() {
    // if the game is over but there is no winning shape
    const marker = this.board.winningMarker();
    console.log({ winningMarker: marker, player: this.#winningPlayerFromMarker(marker) });
    this.winner = this.#winningPlayerFromMarker(marker) ?? constants.DRAW_OUTCOME_NAME;
  }

  getOutcomeString() {
    const drawString = 'Match ended in a draw!';
    const winnerString = `${this.winner} won the match!`;
    const outcomeString = this.winner === constants.DRAW_OUTCOME_NAME ? drawString : winnerString;
    return outcomeString;
  }
}

module.exports = { Match };
