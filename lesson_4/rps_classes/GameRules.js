const DEFAULT_MOVE_OPTIONS = ['rock', 'paper', 'scissors'];

const DEFAULT_MOVE_COMPARATOR = (obj, current, idx, arr) => {
  const loopedPrevIndex = idx === 0 ? arr.length - 1 : idx - 1;
  const previousElement = arr[loopedPrevIndex];
  const rule = { [current]: previousElement };
  return Object.assign(obj, rule)
};

class GameRules {
  constructor(
    moveOptions = DEFAULT_MOVE_OPTIONS,
    moveComparator = DEFAULT_MOVE_COMPARATOR,
  ) {
      this.moveOptions = moveOptions;
      this.moveComparator = moveComparator;
      this.moveBeats = moveOptions.reduce(this.moveComparator, {});
  }

  calcResult(humanMove, computerMove) {
    if (humanMove === computerMove) return 'draw';
    if (this.moveBeats[humanMove] === computerMove) return 'human';
    if (this.moveBeats[computerMove] === humanMove) return 'computer';
    throw new Error('error calculating result');
  }
}

module.exports = { GameRules };