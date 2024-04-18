function Car({ make, model, year }) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.started = false;

  this.start = function () {
    this.started = true;
  };

  this.stop = function () {
    this.started = false;
  };
}

const corollaArgs = {
  make: 'Toyota',
  model: 'Corolla',
  year: 2016,
};
// invoking the constructor to create instances
const firstCorolla = new Car(corollaArgs);
console.log({ firstCorolla });
// {make: 'Toyota', model: 'Corolla', year: 2016, started: false...}


// reimplementation of the new keyword as a function
function createNew(constructor, argObj) {
  const newObj = Object.create(constructor.prototype);
  const returned = constructor.call(newObj, argObj);
  const objectReturned = (returned !== null) && (typeof returned === 'object');
  return objectReturned ? returned : newObj;
}
debugger;
const secondCorolla = createNew(Car, corollaArgs);
console.log({ secondCorolla });
console.log({ secondCorollaIsCar: secondCorolla instanceof Car });

/**
 * A factory function that doesn't copy methods to every instance.
 * Todo:
 * Figure out how to make the returned object an instance of the prototype
 * - replace 'constructor' with the reference to the prototype of
 * constructor functions such as Car above
 */
function createCar(args) {
  const carConstructor = {
    start() {
      this.started = true;
    },

    stop() {
      this.started = false;
    },
  }; 

  const carProps = {
    make: null,
    model: null,
    year: null,
    started: null,
  };
  debugger;


  const defaults = {
    started: false,
  }

  const car = Object.create(carConstructor);
  // filter out args not found on carProps
  const filteredArgs = Object.fromEntries(Object.entries(args)
      .filter(([key, val]) => Object.keys(carProps).includes(key)));

  const instanceProps = {...defaults, ...filteredArgs};
  Object.assign(car, instanceProps);

  Object.defineProperty(car, 'prototype', {
    value: Car,
    writable: true,
    enumerable: false,
    configurable: false,
  });

  return car;
}

const civicArgs = {
  make: 'Honda',
  model: 'Civic',
  year: 2016,
  color: 'black',
  passengers: 5,
  convertible: false,
  mileage: 16000,
};

const civic = new Car(civicArgs);
console.log({ civic });
// console.log({ civicHiddenProps: Object.getOwnPropertyDescriptors(civic) });

const civicAlt = createCar(civicArgs);
console.log({ civicAlt });
// civicAlt.start();
// console.log({ civicAlt });
debugger;