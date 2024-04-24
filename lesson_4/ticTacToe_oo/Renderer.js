const constants = require('./constants.json');
/**
 * Display the game while a match is ongoing
 * 
 * Layout: arrange the following in a grid:
 * - title (containing current match state - ongoing or over), centered above game board
 * - game board on left
 * - scoreboard on the right of the game board
 * - current turn prompt with player name and prompt line
 *   - store as status property on the match, and display that under the board
 * - (optional) action log on the left of the game board
 *   - actions stored as an array of {player, moveAddress} pairs
 *   - displayed as `${player.displayName()}: ${moveAddress}`
 * 
 * Algorithm:
 * Take the match, scoreboard, and game board as inputs
 * Call the display method after a a match is started, a player makes a move, and a match ends
 * 
 * 
 * Display():
 * - initialize a 2d array 'displayGrid' where each subarray represents a row in an imaginary grid of elements to display, and each element of the subarray is an array of displaylines
 * - use a getDisplayLines() method on game state to get an array of rows for the game board, scoreboard, and action log, and store that in displayGrid
 * - map the grid rows to arrays of lines `renderLines`
 * - clear the console
 * - flatten `renderLines` and iterate over it, logging each line to the console
 * 
 * gridRowToLines():
 * - copy a row gridRowElements from displayGrid
 * - create a new array, renderLines
 * - map gridRowElements to the width of grid cells
 * - store the length of the longest subarray as `finalLineCount`
 * - impute strings of spaces to make each subarray of
 *   gridRowElements contain the same number of elements
 * - Looping from 0 to finalLineCount:
 *   - initialize a string variable 'renderLine'
 *   - loop over gridRowElements, concatenating subarray[i] to renderLine
 *   - push renderLine to renderLines
 * - return renderLines
 */
class Renderer {
  #gameState = {
    actionLog: null,
    gameBoard: null,
    scoreBoard: null,
  };

  constructor(match, scoreboard) {
    this.match = match;
    this.gameBoard = match.board;
    this.scoreboard = scoreboard;
    this.paddingString = ' '.repeat(constants.RENDERER_ELEMENT_PADDING);
  }

  get gameState() {
    this.#gameState.actionLog = this.match.getActionDisplayLines();
    this.#gameState.gameBoard = this.gameBoard.getDisplayLines();
    this.#gameState.scoreBoard = this.scoreboard.getDisplayLines();
    return this.#gameState;
  }

  display() {
    const renderLines = this.getDisplayLines();
    // console.clear();
    renderLines.forEach((line) => console.log(line));
  }

  static maxElementLength(arr) {
    return arr.reduce((max, el) => Math.max(el.length, max), 0);
  }
  
  static gridCellWidth(gridCell) {
    return Renderer.maxElementLength(gridCell);
  }

  static imputeEmptySpace(gridCell, lineWidth, targetLineCount) {
    const space = ' ';
    const spaceLine = space.repeat(lineWidth);
    const spaced = gridCell.map((line) => line.padEnd(lineWidth, space));
    while (spaced.length < targetLineCount) {
      spaced.push(spaceLine);
    }
    return spaced;
  }

  titleLineOffset(gameStateOrder, gameBoard, titleLine) {
    const boardIdx = gameStateOrder.indexOf(gameBoard);
    const precedingCells = gameStateOrder.slice(0, boardIdx);
    const cellWidths = precedingCells.map(Renderer.gridCellWidth);
    const boardWidth = Renderer.gridCellWidth(gameStateOrder[boardIdx]);
    const boardFrontSpace = Math.floor((boardWidth - titleLine.length) / 2);
    return {
      titleOffset: cellWidths.reduce((sum, el) => sum + el, 0), 
      titleFiller: boardFrontSpace,
    };
  }

  formatTitleLine(gameStateOrder, gameBoard) {
    const rawTitleLine = this.match.getTitleDisplayLine();
    const { titleOffset, titleFiller } = this.titleLineOffset(gameStateOrder, gameBoard, rawTitleLine);
    const fillerStr = '+'.repeat(titleFiller);
    const titleWithFiller = fillerStr + rawTitleLine + fillerStr;
    const titleLine = this.paddingString + titleWithFiller.padStart(titleOffset + titleWithFiller.length, ' ') + '\n';
    return titleLine;
  }

  gridRowToLines(rowArr) {
    const gridRow = JSON.parse(JSON.stringify(rowArr));
    const renderLines = [];
    const cellWidths = gridRow.map(Renderer.gridCellWidth);
    const finalLineCount = Renderer.maxElementLength(gridRow);
    const spaced = gridRow.map((cell, idx) => Renderer.imputeEmptySpace(cell, cellWidths[idx], finalLineCount));

    for (let i = 0; i < finalLineCount; i += 1) {
      let renderLineSegments = [];
      spaced.forEach((cell) => renderLineSegments.push(cell[i]));
      const renderLine = renderLineSegments.join(this.paddingString);
      renderLines.push(renderLine);
    }

    return renderLines;
  }

  static centeringOffset(cell, str) {
    return Math.floor((Renderer.gridCellWidth(cell) - str.length) / 2);
  }

  getStateWithTitles() {
    const { actionLog, gameBoard, scoreBoard } = this.gameState;
    const rawActionLogTitle = constants.RENDERER_ACTION_LOG_TTTLE;
    const actionLogTitle = rawActionLogTitle.padStart(Renderer.centeringOffset(actionLog, rawActionLogTitle), ' ');
    actionLog.unshift(actionLogTitle);

    const rawScoreBoardTitle = constants.RENDERER_SCOREBOARD_TTTLE;
    const scoreBoardTitle = rawScoreBoardTitle.padStart(Renderer.centeringOffset(scoreBoard, rawScoreBoardTitle), ' ');
    scoreBoard.unshift(scoreBoardTitle);

    return { actionLog, gameBoard, scoreBoard }
  }

  getDisplayLines() {
    const { actionLog, gameBoard, scoreBoard } = this.getStateWithTitles();
    const gameStateOrder = [actionLog, gameBoard, scoreBoard];
    const gameStateLines = this.gridRowToLines(gameStateOrder);
    gameStateLines.push('\n');
    const titleLine = this.formatTitleLine(gameStateOrder, gameBoard);
    return [titleLine, ...gameStateLines];
  }
}

module.exports = { Renderer };
