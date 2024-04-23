class ScoreBoard {
  constructor(players) {
    players.forEach((player) => {
      this[player.name] = {
        marker: player.marker,
        score: 0,
      };
    });
  }

  addWin(winner) {
    this[winner.name].score += 1;
  }

  getDisplayLines() {

  }

  display() {

  }
}

module.exports = { ScoreBoard };
