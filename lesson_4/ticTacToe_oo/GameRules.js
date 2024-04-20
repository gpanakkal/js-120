const constants = require('./constants.json');
const { computerPlayer, humanPlayer } = require('./Player');
/**
 * Define:
 * board size
 * winning line length
 * player count
 * human player count
 * computer player count
 * player names and markers
 */
class GameRules {
  constructor() {
    const firstHuman = new Player(constants.DEFAULT_HUMAN_BASE_NAME);
    this.players = [firstHuman];

    this.boardLength = this.promptBoardLength(firstHuman);
    this.winningLineLength = this.promptWinningLineLength(firstHuman);
    const playerCount = this.promptPlayerCount(firstHuman);
    const humanPlayerCount = this.promptHumanPlayerCount(firstHuman, playerCount);
    const humanPlayerNames = this.promptHumanPlayerNames(firstHuman);

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

  promptWinningLineLength(firstHuman) {
    const defaultWinLength = this.boardLength;

  }

  promptPlayerCount(firstHuman) {
    const min = constants.MIN_PLAYER_COUNT;
    const max = constants.MAX_PLAYER_COUNT;
    const defaultPlayerCount = constants.DEFAULT_PLAYER_COUNT;

    const playerCountPrompt = `Enter a player count from ${min} to ${max}`;
    const useDefaultPrompt = `or press enter to use the default (${defaultPlayerCount})`;
    const fullPrompt = `${playerCountPrompt}, ${useDefaultPrompt}: `;

    return firstHuman.getNumberInput(min, max, defaultPlayerCount, fullPrompt);
  }

  promptHumanPlayerCount(firstHuman, playerCount) {
    const min = constants.MIN_HUMAN_PLAYER_COUNT;
    const max = playerCount;
    // if (min === max) return min;
    const defaultHumanCount = constants.DEFAULT_HUMAN_PLAYER_COUNT;

    const playerCountPrompt = `Enter a human player count from ${min} to ${max}`;
    const useDefaultPrompt = `or press enter to use the default (${defaultHumanCount})`;
    const fullPrompt = `${playerCountPrompt}, ${useDefaultPrompt}: `;

    return firstHuman.getNumberInput(min, max, defaultHumanCount, fullPrompt);
  }
}

module.exports = { GameRules };