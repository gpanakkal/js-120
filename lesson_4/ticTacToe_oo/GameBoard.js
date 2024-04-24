const constants = require('./constants.json');

class GameBoard {
  #state;

  static directionVectors = {
    right: [1, 0],
    down: [0, 1],
    diagonalUp: [1, -1],
    diagonalDown: [1, 1],
  };

  constructor(sideLength, winningLineLength) {
    this.emptyCellValue = constants.BOARD_EMPTY_CELL_SHAPE;
    this.sideLength = sideLength;
    this.cellSideLength = constants.BOARD_CELL_SIDE_LENGTH;

    this.labels = {
      rows: constants.BOARD_ROW_LABELS.slice(0, this.sideLength),
      columns: constants.BOARD_COLUMN_LABELS.slice(0, this.sideLength),
    };

    this.winningLineLength = winningLineLength;
    this.#state = this.initializeState();
    this.victoryLines = this.initializeVictoryLines();
  }

  /**
   * Set up the game board and all winning combinations
   */
  initializeState() {
    const mapRowCells = (rowLabel, columnLabel) => ({ [`${rowLabel}${columnLabel}`]: this.emptyCellValue });

    const cells = this.labels.rows.map((rowLabel) => this.labels.columns
      .map((columnLabel) => mapRowCells.call(this, rowLabel, columnLabel))
      .reduce((rowObj, cell) => Object.assign(rowObj, cell), {}));
    return cells.reduce((obj, cell) => Object.assign(obj, cell), {});
  }

  get state() {
    return this.#state;
  }

  // given a formatted cell, update state
  set state(cell) {
    const { row, col, val } = cell;
    const address = `${row}${col}`;
    this.#state[address] = val;
  }

  getStateEntries() {
    return Object.entries(this.#state);
  }

  static getVector(direction, magnitude) {
    if (!(direction in GameBoard.directionVectors)) return undefined;
    return GameBoard.directionVectors[direction].map((comp) => comp * magnitude);
  }

  /**
   * Fetches the cell address at an offset relative to the current cell
   * @param {number[]} offsetVector a 2-tuple of vector components
   * @param {string} currentCellAddress The address of the current cell as a string, e.g., "1M"
   */
  getOtherCell(offsetVector, currentCellAddress) {
    const [x, y] = offsetVector;
    const [cellRow, cellColumn] = currentCellAddress.split('');
    const { rows: rowLabels, columns: columnLabels } = this.labels;

    const currentY = rowLabels.indexOf(cellRow);
    const currentX = columnLabels.indexOf(cellColumn);

    const nextCellRow = rowLabels[currentY + y];
    const nextCellColumn = columnLabels[currentX + x];
    if (!nextCellRow || !nextCellColumn) return null;
    return `${nextCellRow}${nextCellColumn}`;
  }

  // get a line of cell addresses of length winningLineLength
  getLine(direction, currentCellAddress) {
    const line = new Array(this.winningLineLength).fill(null).map((_, idx) => {
      const offset = GameBoard.getVector(direction, idx);
      return this.getOtherCell(offset, currentCellAddress);
    });
    if (line.some((el) => el === null)) return null;
    return line;
  }

  /**
   * Generate all potential victory lines as arrays of cell addresses
   * algorithm:
   * - for each cell, generate arrays of lines of cells going right, down,
   * diagonal up-right, and diagonal down-right of length winningLineLength
   */
  initializeVictoryLines() {
    const directions = Object.keys(GameBoard.directionVectors);
    const allLines = Object.keys(this.state).reduce((outputArr, cellAddress) => {
      const lines = directions.map((dir) => this.getLine(dir, cellAddress))
        .filter((line) => line !== null);
      return outputArr.concat(lines);
    }, []);
    // console.log({ allLines });
    return allLines;
  }

  // return a marker if a winning line is filled with a single marker; else return null
  winningMarker() {
    const isWinningLine = (line) => {
      const lineValues = line.map((cellAddress) => this.state[cellAddress]);
      const noEmptyCells = lineValues.every((value) => value !== this.emptyCellValue);
      const valuesAreHomogenous = new Set(lineValues).size === 1;
      return noEmptyCells && valuesAreHomogenous;
    };

    const winningLine = this.victoryLines.filter(isWinningLine)[0];
    if (!winningLine) return null;
    return this.state[winningLine[0]];
  }

  // for even-length arrays, returns the first of the two indices at the center
  static #middleIndex(arr) {
    return Math.ceil(arr.length / 2 - 1);
  }

  centerCell() {
    const middleIndex = GameBoard.#middleIndex(this.labels.rows);
    return this.labels.rows[middleIndex] + this.labels.columns[middleIndex];
  }

  #rowToString(rowValues) {
    const spaceChar = ' ';
    const cellWidth = this.cellSideLength * constants.BOARD_CELL_WIDTH_MULT;

    const stringComponents = rowValues.map(({ value }) => {
      const segment = Array(cellWidth).fill(spaceChar);
      segment.splice(GameBoard.#middleIndex(segment), 1, value);
      return segment.join('');
    });

    const joined = stringComponents.join(constants.BOARD_COLUMN_SEPARATOR);
    return joined;
  }

  #boardCharWidth() {
    const cellCharWidth = this.cellSideLength * constants.BOARD_CELL_WIDTH_MULT;
    const rowLabelWidth = constants.BOARD_CELL_WIDTH_MULT;
    return this.sideLength * cellCharWidth + rowLabelWidth + 9;
  }

  #boardRowToString(boardRow) {
    const spaceChar = ' ';
    // const cellCharWidth = this.cellSideLength * constants.BOARD_CELL_WIDTH_MULT;
    // const boardCharWidth = this.sideLength * cellCharWidth;

    const spaces = new Array(this.sideLength + 1).fill({ address: '', value: spaceChar });
    const spaceLineString = this.#rowToString(spaces);
    const renderLines = new Array(this.cellSideLength).fill(spaceLineString);

    const rowLabel = boardRow[0].address.split('')[0];
    const rowWithLabel = [{ address: 'label', value: rowLabel }, ...boardRow];
    const rowString = this.#rowToString(rowWithLabel);

    renderLines[GameBoard.#middleIndex(renderLines)] = rowString;
    return renderLines;
  }

  #insertRowSeparators(boardRowStrings) {
    const rowSeparatorLine = constants.BOARD_ROW_SEPARATOR.repeat(this.#boardCharWidth());
    for (let i = boardRowStrings.length; i >= 0; i -= 1) {
      boardRowStrings.splice(i, 0, rowSeparatorLine);
    }
  }

  #boardRowsFromEntries() {
    return this.getStateEntries().reduce((rowObj, [address, value]) => {
      const rowLabel = address.split('')[0];
      const item = { address, value };
      if (rowLabel in rowObj) {
        rowObj[rowLabel].push(item);
      } else {
        Object.assign(rowObj, { [rowLabel]: [item] });
      }
      return rowObj;
    }, {});
  }

  getDisplayLines() {
    const columnLabels = [' '].concat(this.labels.columns);
    const columnLabelString = this.#rowToString(columnLabels.map((label) => ({ address: '', value: label })));

    const renderRows = [columnLabelString];
    const boardRows = this.#boardRowsFromEntries();
    const boardRowStrings = Object.values(boardRows).map(this.#boardRowToString.bind(this));
    this.#insertRowSeparators(boardRowStrings);
    renderRows.push(...boardRowStrings.flat(Infinity));
    return renderRows;
  }

  display() {
    const renderRows = this.getDisplayLines();
    renderRows.forEach((row) => console.log(row));
  }

  isEmptyCell(address) {
    return this.state[address] === this.emptyCellValue;
  }

  getEmptyCellEntries() {
    return this.getStateEntries(true).filter((cell) => cell[1] === this.emptyCellValue);
  }

  getEmptyCellNames() {
    return this.getEmptyCellEntries().map((entry) => entry[0]);
  }

  isFull() {
    return this.getEmptyCellEntries().length === 0;
  }
}

module.exports = { GameBoard };
