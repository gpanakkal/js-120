function Rectangle(length, width) {
  this.length = length;
  this.width = width;
}

Rectangle.prototype.getArea = function() {
  return this.length * this.width;
}

Rectangle.prototype.toString = function() {
  return `[Rectangle ${this.length} x ${this.width}]`;
}

function Square(sideLength) {
  this.length = sideLength;
  this.width = sideLength;
}

// Square.prototype = Object.create(Rectangle.prototype);

Square.prototype.toString = function() {
  return `[Square ${this.length} x ${this.width}]`;
}

Object.setPrototypeOf(Square.prototype, Rectangle.prototype);

let sqr = new Square(5);
console.log({square: sqr, area: sqr.getArea()}); // => 25