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

  static getModalShapeEntry(shapeFreqs) {
    const shapeFreqEntries = Object.entries(shapeFreqs);
    // if (shapeFreqEntries.length === 0) return [' ', 0];
    return shapeFreqEntries.toSorted((a, b) => b[1] - a[1])[0];
  }

  static threatLines(board, marker, maxEmptyCells = 1) {
    const winningLineLength = board.victoryLines[0].length;
    const maxCellsRemaining = Math.min(winningLineLength, maxEmptyCells);

    const potentialThreatLines = board.victoryLines.filter((line) => {
      const shapeCounts = ComputerPlayer.countShapesInLine(board, line);
      const { empty: emptyCellCount, ...nonEmpty } = shapeCounts;
      console.log({ nonEmpty });
      let modalShape = marker;
      let modalShapeCount = 0;
      if (Object.keys(nonEmpty).length > 0) {
        [modalShape, modalShapeCount] = ComputerPlayer.getModalShapeEntry(nonEmpty);
      }
      const correctMarker = modalShape === marker;
      const enoughCellsEmpty = emptyCellCount <= maxCellsRemaining;
      const enoughCellsFilled = modalShapeCount + maxCellsRemaining >= winningLineLength;
      return correctMarker && enoughCellsEmpty && enoughCellsFilled;
    });

    return potentialThreatLines;
  }

  static firstThreatCell(board, threatLines) {
    const firstEmptyCell = threatLines[0].filter((address) => board.isEmptyCell(address))[0];
    console.log({ firstEmptyCell });
    return firstEmptyCell;
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

  static threatLinesPerCell(threatLines) {
    return threatLines.reduce((obj, threatLine) => {
      threatLine.forEach((cell) => {
        if (cell in obj) obj[cell] += 1;
        else obj[cell] = 1;
      });
      return obj;
    }, {});
  }

  /**
   * Choose the cell leading to a win in the fewest moves,
   * and belonging to the most winning combinations.
   */
  findBestNonWinningMove(board) {
    const winningLineLength = board.victoryLines[0].length;
    for (let i = 2; i <= winningLineLength; i += 1) {
      const partialThreatLines = ComputerPlayer.threatLines(board, this.marker, i);

      if (partialThreatLines.length > 0) {
        const threatLinesPerCell = ComputerPlayer.threatLinesPerCell(partialThreatLines);
        const threatLinesPerEmptyCell = Object.entries(threatLinesPerCell)
        .filter(([address, count]) => board.state[address] === board.emptyCellValue);
        const maxLines = Math.max(...threatLinesPerEmptyCell.map((entry) => entry[1]));
        console.log({ threatLinesPerCell, threatLinesPerEmptyCell, maxLines });
        const bestOptions = threatLinesPerEmptyCell.filter(([address, count]) => count === maxLines)
          .map(([address]) => address);
        console.log({ bestOptions });
        return ComputerPlayer.selectRandomCell(bestOptions);
      }
    }
    return undefined;
  }

  static selectRandomCell(availableCells) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }

  selectCell(board, players) {
    const availableCells = board.getEmptyCellNames(board.state);
    console.log({ availableCells });
    const winningMoves = ComputerPlayer.threatLines(board, this.marker);
    const opponentWinningMoves = this.#opponentWinningMoves(board, players);

    if (winningMoves.length > 0) {
      return ComputerPlayer.firstThreatCell(board, winningMoves);
    }
    if (opponentWinningMoves.length > 0) {
      return ComputerPlayer.firstThreatCell(board, opponentWinningMoves);
    }
    return this.findBestNonWinningMove(board) ?? ComputerPlayer.selectRandomCell(availableCells);
  }

  makeMove(board, players) {
    const cell = this.selectCell(board, players);
    // console.log({ cell, move: this.getFormattedMove(cell) });
    return this.getFormattedMove(cell);
  }
}

module.exports = { ComputerPlayer };
