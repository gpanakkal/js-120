const constants = require('./constants.json');

class Cell {
  constructor(rowLabel, columnLabel, value) {
    this.row = rowLabel;
    this.col = columnLabel;
    this.val = value;
  }
}
/**
 * Update and display the game board
 */
class Board {
  constructor(sideLength, winningLineLength) {
    this.emptyCellValue = ' ';
    this.sideLength = sideLength;
    this.winningLineLength = winningLineLength;
    this.initializeState();
    
    // console.log({board: this});
  }

  getLabels() {
    const rowLabels = constants.BOARD_ROW_LABELS.slice(0, this.sideLength);
    const columnLabels = constants.BOARD_COLUMN_LABELS.slice(0, this.sideLength);
    return {rowLabels, columnLabels};
  }

  initializeState() {
    const { rowLabels, columnLabels } = this.getLabels();

    const mapRowCells = (rowLabel, columnLabel) => ({[`${rowLabel}${columnLabel}`]: this.emptyCellValue});

    const cells = rowLabels.map((rowLabel) => columnLabels
      .map((columnLabel) => mapRowCells.call(this, rowLabel, columnLabel))
      .reduce((rowObj, cell) => Object.assign(rowObj, cell), {}))
      // .flat(Infinity);
    console.log({cells});
    // this._state = cells;
    this._state = cells.reduce((obj, cell) => Object.assign(obj, cell), {});
  }

  get state() {
    return this._state;
  }

  getStateEntries() {
    return Object.entries(this.state);
  }

  // given a formatted cell, update state
  set state(cell) {
    const {row, col, val} = cell;
    const address = `${row}${col}`;
    this._state[address] = val;
  }

  // generate all winning lines as arrays of cells
  winningLines() {
    const { rowLabels, columnLabels } = this.getLabels();
    const getCombos = (arr, len) => arr.reduce((combos, el, idx) => {
      const slice = arr.slice(idx, idx + len);
      if (slice.length !== len) return combos;
      combos.push(slice);
      return combos;
    }, []);

    const winningRowLabelCombos = getCombos(rowLabels, this.winningLineLength);
    const winningColLabelCombos = getCombos(columnLabels, this.winningLineLength);

    // for each row label, get lines of columns
    const 
  }

  // a winning is filled with a single shape
  WinnerExists() {

  }

  render() {

  }

  getEmptyCells() {
    return this.getState(true).filter((cell) => cell.value === this.emptyCellValue);
  }

  boardIsFull() {
    return this.getEmptyCells().length === 0;
  }

}

module.exports = { Board };