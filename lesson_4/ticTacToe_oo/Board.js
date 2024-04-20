const constants = require('./constants.json');
/**
 * Update and display the game board
 */
class Board {
  constructor(sideLength) {
    const newRow = () => constants.DEFAULT_PLAYER_MARKERS.slice(0, sideLength)
      .reduce((obj, current) => Object.assign(obj, {[current]: ' '}), {});

    this.state = new Array(sideLength).map((el) => newRow());
    console.log({board: this.board});
  }
}

module.exports = { Board };