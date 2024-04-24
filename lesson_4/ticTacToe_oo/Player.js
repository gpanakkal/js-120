const constants = require('./constants.json');

class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
  }

  displayName() {
    return `${this.name} (${this.marker})`;
  }

  getFormattedMove(cellAddress) {
    const [rowLabel, columnLabel] = cellAddress.split('');
    return { row: rowLabel, col: columnLabel, val: this.marker };
  }
}

module.exports = { Player };
