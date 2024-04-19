function GameRules(
  moveOptions = ['rock', 'paper', 'scissors'],
  moveComparator = (obj, current, idx, arr) => {
    const loopedPrevIndex = idx === 0 ? arr.length - 1 : idx - 1;
    const previousElement = moveOptions[loopedPrevIndex];
    const rule = { [current]: previousElement };
    return Object.assign(obj, rule)
  },
) {
  this.moveOptions = moveOptions;
  this.moveComparator = moveComparator;
  this.moveBeats = moveOptions.reduce(this.moveComparator, {});
}

GameRules.prototype = {
  constructor: GameRules,

  calcResult(humanMove, computerMove) {
    if (humanMove === computerMove) return 'draw';
    if (this.moveBeats[humanMove] === computerMove) return 'human';
    if (this.moveBeats[computerMove] === humanMove) return 'computer';
    throw new Error('error calculating result');
  },
}
module.exports = { GameRules };