/**
 * 1. RECTANGLE.area and .perimeter are called as methods of RECTANGLE and refer to uninitialized properties width and height. Doing arithmetic on undefined results in NaN.
 * 2. Fix the code by calling using .call(this):
 */
let RECTANGLE = {
  area: function() {
    return this.width * this.height;
  },
  perimeter: function() {
    return 2 * (this.width + this.height);
  },
};

function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.area = RECTANGLE.area.call(this);
  this.perimeter = RECTANGLE.perimeter.call(this);
}

let rect1 = new Rectangle(2, 3);

// console.log(rect1.area);
// console.log(rect1.perimeter);
/**
 * 3. 
 */
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.area = function() {
  return this.radius ** 2 * Math.PI;
};

let a = new Circle(3);
let b = new Circle(4);

// console.log(a.area().toFixed(2)); // => 28.27
// console.log(b.area().toFixed(2)); // => 50.27
// console.log(a.hasOwnProperty('area')); // => false
/**
 * 4. This logs true because even though swingSword is assigned to the prototype after
 *    ninja is initialized, Ninja.prototype is already assigned as ninja's prototype
 * 
 * 5. This returns an error because while Ninja.prototype is reassigned to an object that
 *    has a swingSword method, ninja's prototype is still the previous object that
 *    Ninja.prototype was assigned to, and this did not have a swingSword function.
 * 
 * 6. 
 */
// function Ninja() {
//   this.swung = false;
// }

// // Add a swing method to the Ninja prototype which
// // modifies `swung` and returns the calling object
// Ninja.prototype.swing = function() {
//   this.swung = true;
//   return this;
// }

// let ninjaA = new Ninja();
// let ninjaB = new Ninja();

// console.log(ninjaA.swing().swung);      // logs `true`
// console.log(ninjaB.swing().swung);      // logs `true`
/**
 * 7. create a new instance of an object, without having direct access to the constructor function
 */
let ninjaA;

{
  const Ninja = function() {
    this.swung = false;
  };

  ninjaA = new Ninja();
}

// create a `ninjaB` object here; don't change anything else
// const ninjaB = new ninjaA.constructor();
// console.log({ ninjaA, ninjaB });
// console.log(ninjaA.constructor === ninjaB.constructor); // => true
/**
 * 8. Write a constructor function that can be used with or without the `new` keyword.
 */
function User(first, last) {
  if (!(this instanceof User)) {
    return new User(first, last);
  }

  this.name = `${first} ${last}`;
}

let name = 'Jane Doe';
let user1 = new User('John', 'Doe');
let user2 = User('John', 'Doe');

console.log(name);         // => Jane Doe
console.log(user1.name);   // => John Doe
console.log(user2.name);   // => John Doe
console.log({ user1, user2 });