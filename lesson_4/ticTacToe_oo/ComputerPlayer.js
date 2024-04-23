/* eslint-disable no-param-reassign */
const { Player } = require('./Player');

class ComputerPlayer extends Player {
  currentlyFilledCells(boardState) {
    const isOwnedCell = (cellEntry) => cellEntry[1] === this.marker;
    const filledCells = Object.entries(boardState).filter(isOwnedCell);
    return filledCells.map(([key]) => key);
  }

  static countShapesInLine(board, line) {
    return line.reduce((counts, address) => {
      const shape = board.state[address];
      const key = shape === board.emptyCellValue ? 'empty' : shape;
      counts[key] = counts[key] ? counts[key] + 1 : 1;
      return counts;
    }, {});
  }

  /**
   * Get all lines which are just one empty space away from victory for the given marker
   */
  static threatLines(board, marker = undefined) {
    const winningLineLength = board.victoryLines[0].length;
    const threatLines = board.victoryLines.filter((line) => {
      const shapeCounts = ComputerPlayer.countShapesInLine(board, line);
      const { empty: emptyCellCount, ...nonEmpty } = shapeCounts;
      const oneCellShort = Math.max(...Object.values(nonEmpty)) === winningLineLength - 1;
      const checkMarker = marker !== undefined ? Object.keys(nonEmpty)[0] === marker : true;
      return emptyCellCount === 1 && oneCellShort && checkMarker;
    });
    return threatLines;
  }

  static firstThreatCell(board, threatLines) {
    return threatLines[0].filter((address) => board.isEmptyCell(address))[0];
  }

  makeMove(board, players) {
    const winningMoves = ComputerPlayer.threatLines(board, this.marker);
    // if there is a winning move, make it
    if (winningMoves.length > 0) {
      return ComputerPlayer.firstThreatCell(board, winningMoves);
    }
    // else if an opponent has a winning move, block it
    const isCurrentPlayer = (player) => player === this;
    const opponentWinningMoves = [];
    players.filter(!isCurrentPlayer)
      .forEach((player) => opponentWinningMoves
        .push(...ComputerPlayer.threatLines(board, player.marker)));
    if (opponentWinningMoves.length > 0) {
      return ComputerPlayer.firstThreatCell(board, opponentWinningMoves);
    }
    // else if the center is available, fill it
    const availableCells = board.getEmptyCellEntries(board.state).map((entry) => entry[0]);
    const centerCell = board.centerCell();
    const centerIsAvailable = availableCells.includes(centerCell);
    if (centerIsAvailable) return centerCell;
    // else fill a random cell
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }
}

module.exports = { ComputerPlayer };
