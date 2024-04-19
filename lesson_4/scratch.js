const Swimmable = {
  swim() {}
}

const Flyable = {
  fly() {}
}

class Stork {}
Object.assign(Stork.prototype, Flyable);

class Parrot {}
Object.assign(Parrot.prototype, Flyable);

class Penguin {}
Object.assign(Penguin.prototype, Swimmable);

class Ostrich {}
Object.assign(Ostrich.prototype, Swimmable);

class Duck {}
Object.assign(Duck.prototype, {Swimmable}, Flyable);

class Goose {}
Object.assign(Goose.prototype, {Swimmable}, Flyable);

console.log(Duck.prototype)
console.log(Duck.prototype.Swimmable.swim === Goose.prototype.Swimmable.swim)
console.log(Duck.prototype.fly === Goose.prototype.fly)