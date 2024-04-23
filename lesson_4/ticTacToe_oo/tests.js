/* eslint-disable no-unused-vars */
const { Board } = require('./Board');
const { GameRules } = require('./GameRules');
const { TicTacToeGame } = require('./ticTacToe');

// const rules = new GameRules();
// const game = new TicTacToeGame();

const boardLength = 3;
const winningLineLength = 3;
const board = new Board(boardLength, winningLineLength);
// console.log({ state: board.state });

const currentCell = '3M';
const rightVector = Board.getVector('right', 2);
const downVector = Board.getVector('down', 2);
const diagonalUpVector = Board.getVector('diagonalUp', 2);
const diagonalDownVector = Board.getVector('diagonalDown', 2);

// console.log({
//   rightVector, downVector, diagonalUpVector, diagonalDownVector,
// });

const otherCells = {
  current: currentCell,
  right: board.getOtherCell(rightVector, currentCell),
  down: board.getOtherCell(downVector, currentCell),
  diagonalUp: board.getOtherCell(diagonalUpVector, currentCell),
  diagonalDown: board.getOtherCell(diagonalDownVector, currentCell),
};

// console.log(otherCells);

// console.log({ victoryLines: board.victoryLines, count: board.victoryLines.length });

const secondBoard = new Board(boardLength, winningLineLength);
const stateComparison = {
  sameState: board.state === secondBoard.state,
  firstState: board.state,
  secondState: secondBoard.state,
};

board.state = { row: '1', col: 'O', val: 'B' };
board.state = { row: '1', col: 'N', val: 'B' };
board.state = { row: '1', col: 'M', val: 'B' };
// console.log(stateComparison);
board.state = { row: '2', col: 'O', val: 'A' };
board.state = { row: '3', col: 'O', val: 'A' };

console.log({ state: board.state });
const cellAddress = '1M';
// console.log({ valueAt1M: board.state[cellAddress] });

console.log({ winningShape: board.winningShape() });

board.display();
