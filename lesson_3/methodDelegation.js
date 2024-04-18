function Dog(name, breed, weight) {
  this.name = name;
  this.breed = breed;
  this.weight = weight;
}

Dog.prototype.bark = function() {
  console.log(this.weight > 20 ? 'Woof!' : 'Yip!');
};

const maxi = new Dog('Maxi', 'German Shepherd', 32);
maxi.bark();
console.log(Object.hasOwn(maxi, 'bark'));
console.log({constructor: Dog.prototype.constructor});
