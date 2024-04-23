class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
  }

  displayName() {
    return `${this.name} (${this.marker})`;
  }
}

module.exports = { Player };
