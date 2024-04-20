const { Player } = require('./Player');
const { constants } = require('./constants.json');
/**
 * Game engine
 */
class TicTacToeGame {
  /**
   * Create a human player, then
   * Prompt user to specify:
   * - board size
   * - player count
   * - how many players should be computer-controlled
   * - names for each human player (defaulting to greek alphabet matching their marker)
   */
  constructor(rules = undefined) {
    const firstHuman = new Player('human');
    this.players = [firstHuman];
    const boardLength = this.promptBoardLength(firstHuman);
    this.initializeBoard(boardLength);
    const playerCount = this.promptPlayerCount(firstHuman);
    const computerPlayerCount = this.promptComputerPlayerCount(firstHuman);
    const humanPlayerNames = this.promptHumanPlayerNames(firstHuman);
    this.rules = rules;
  }

  promptBoardLength(humanPlayer) {
    const minLength = constants.MIN_BOARD_LENGTH;
    const maxLength = constants.MAX_BOARD_LENGTH;
    const boardLengthLimits = `(At least ${minLength}, and at most ${maxLength}): `;
    const boardLengthPrompt = `Select the length of the side of a board.\n${boardLengthLimits}`;
    const invalidLengthMsg = (size) => `Size ${size} is invalid`;
    const isValidLength = (size) => size >= minLength && size <= maxLength;
    const boardSize = humanPlayer.getValidInput(boardLengthPrompt, invalidLengthMsg, isValidLength);
    return boardSize;
  }

  initializeBoard(length) {
    const newRow = () => 'ABCDEFGHIJ'.split('').slice(0, length)
      .reduce((obj, current) => Object.assign(obj, {[current]: ' '}), {});

    this.board = new Array(length).map((el) => newRow());
    console.log({board: this.board});
  }

  initializePlayers(total, computerCount) {

  }
}