const { Player } = require('./Player');

class ScoreBoard {
  static drawEntryName = 'draws';

  constructor(players) {
    this.scores = players.map((player) => ({ player, score: 0 }));
    this.scores.push({
      player: {
        name: ScoreBoard.drawEntryName,
        marker: null,
      },
      score: 0,
    });
  }

  addWin(winner) {
    const winnerName = winner instanceof Player ? winner.name : ScoreBoard.drawEntryName;
    // console.log({ winnerName });
    const winnerEntry = this.scores.find((entry) => entry.player.name === winnerName);
    // console.log({score: this.scores, winnerEntry})
    winnerEntry.score += 1;
  }

  static formattedPlayerName(entry) {
    const formattedName = entry.player.name === ScoreBoard.drawEntryName
      ? ScoreBoard.drawEntryName
      : entry.player.displayName();
    return formattedName;
  }

  // generate a row per player and return an array of rows
  getDisplayLines() {
    const maxNameLength = this.scores.reduce((max, entry) => {
      const formattedName = ScoreBoard.formattedPlayerName(entry);
      return formattedName.length > max ? formattedName.length : max;
    }, 0);

    const boardRows = this.scores.map((entry) => {
      const formattedName = ScoreBoard.formattedPlayerName(entry);
      const paddedName = formattedName.padStart(maxNameLength, ' ');
      const rowString = `${paddedName}: ${entry.score}`;
      return rowString;
    });
    return boardRows;
  }
}

module.exports = { ScoreBoard };
