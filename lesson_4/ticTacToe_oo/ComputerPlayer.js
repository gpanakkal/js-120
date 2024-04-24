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

  static threatLines(board, marker = undefined, maxEmptyCells = 1) {
    const winningLineLength = board.victoryLines[0].length;
    const cellsRemaining = Math.min(winningLineLength, maxEmptyCells);

    const threatLines = board.victoryLines.filter((line) => {
      const shapeCounts = ComputerPlayer.countShapesInLine(board, line);
      const { empty: emptyCellCount, ...nonEmpty } = shapeCounts;

      const nCellsShort = Math.max(...Object.values(nonEmpty)) === winningLineLength - cellsRemaining;

      const correctMarker = marker !== undefined ? Object.keys(nonEmpty)[0] === marker : true;
      return emptyCellCount <= cellsRemaining && nCellsShort && correctMarker;
    });

    console.log({marker, threatLines});
    return threatLines;
  }

  static firstThreatCell(board, threatLines) {
    return threatLines[0].filter((address) => board.isEmptyCell(address))[0];
  }

  #opponentWinningMoves(board, players) {
    const isAnotherPlayer = (player) => player !== this;
    const otherPlayers = players.filter(isAnotherPlayer);
    const opponentWinningMoves = otherPlayers.reduce((arr, player) => {
      arr.push(...ComputerPlayer.threatLines(board, player.marker));
      return arr;
    }, []);
    return opponentWinningMoves;
  }

  makeMove(board, players) {
    let cell;
    const availableCells = board.getEmptyCellNames(board.state);
    const winningMoves = ComputerPlayer.threatLines(board, this.marker);
    const opponentWinningMoves = this.#opponentWinningMoves(board, players);
    // if there is a winning move, make it
    if (winningMoves.length > 0) {
      cell = ComputerPlayer.firstThreatCell(board, winningMoves);
    }
    // else if an opponent has a winning move, block it
    else if (opponentWinningMoves.length > 0) {
      cell = ComputerPlayer.firstThreatCell(board, opponentWinningMoves);
    }
    // const winningLineLength = board.victoryLines[0].length;
    // // else choose a cell leading to a win in the fewest moves,
    // // sorted by number of winning triplets it belongs in
    // for (let i = 2; i <= winningLineLength; i += 1) {
    //   const partialThreatLines = ComputerPlayer.threatLines(board, this.marker, i);
    //   const matchingEmptyCells = availableCells.filter((cell) => partialThreatLines.some((threatLine) => threatLine.includes(cell)));
    // }

    // else if the center is available, fill it
    else if (availableCells.includes(board.centerCell())) {
      cell = board.centerCell();
    }
    // else fill a random cell
    else {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      cell = availableCells[randomIndex];
    }

    console.log({ cell, move: this.getFormattedMove(cell) });
    return this.getFormattedMove(cell);
  }
}

module.exports = { ComputerPlayer };
