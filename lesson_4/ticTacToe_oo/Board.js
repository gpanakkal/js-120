const constants = require('./constants.json');
/**
 * Update and display the game board
 */
class Board {
  constructor(sideLength, winningLineLength) {
    this.emptyCellValue = ' ';
    this.sideLength = sideLength;
    this.winningLineLength = winningLineLength;
    this.state = this.initializeState();
    
    console.log({board: this});
  }

  makeNewRow() {
    const columnLabels = constants.BOARD_COLUMN_LABELS.slice(0, this.sideLength);
    return columnLabels.reduce((obj, current) => Object.assign(obj, {[current]: this.emptyCellValue}), {});
  }

  initializeState() {
    const rowLabels = constants.BOARD_ROW_LABELS.slice(0, this.sideLength);
    return rowLabels.reduce((obj, current) => Object.assign(obj, {[current]: this.makeNewRow()}), {});
  }

  // generate all winning lines as sets of 
  winningLines() {

  }

  winningLineExists() {

  }

  boardIsFull() {
    return this.state.every((cell) => cell !== this.emptyCellValue);
  }

  render() {

  }

  /**
   * Get an array of cell objects of form {rowLabel, columnLabel, value}
   */
  getCells() {
    const entries = Object.entries(this.state);
    return entries.reduce((outputArr, [rowLabel, column]) => {
      const rowCells = Object.entries(column).map(([columnLabel, value]) => ({
          row: rowLabel,
          col: columnLabel,
          value,
        })
      );
      return outputArr.concat(rowCells);
    }, []);
  }

  getEmptyCells() {
    const allCells = this.getCells();
    return allCells.filter((cell) => cell.value === this.emptyCellValue);
  }
}

module.exports = { Board };