/**
 * 1. Given a car, use the speed object as a mixin to make them gofast.
 * How can you check if they can now go fast?
 */
{
  const Speed = {
    goFast() {
      console.log(`I'm a ${this.constructor.name} and going super fast!`);
    }
  };

  class Car {
    goSlow() {
      console.log(`I'm safe and driving slow.`);
    }
  }

  const myCar = new Car();
  Object.assign(myCar, Speed);
  console.log('goFast' in myCar);
}
/**
 * 2. The name of the class is printed by accessing the constructor of the instance of Car
 * 
 * 3. Modify class defs and move code into mix-ins as appropriate.
 * 
 * Soln: 
 * - Make parent class vehicle to store fuel and efficiency
 * - Make mix-in for wheeled vs propeller-driven locomotion
 */
{
  class Vehicle {
    constructor(kmTravelledPerLiter, fuelCapInLiter) {
      this.kmTravelledPerLiter = kmTravelledPerLiter;
      this.fuelCapInLiter = fuelCapInLiter;
    }
  }

  class WheeledVehicle extends Vehicle {
    constructor(tirePressure, kmTravelledPerLiter, fuelCapInLiter) {
      super(kmTravelledPerLiter, fuelCapInLiter);
      this.tires = tirePressure;
    }

    tirePressure(tireIdx) {
      return this.tires[tireIdx];
    }

    inflateTire(tireIdx, pressure) {
      this.tires[tireIdx] = pressure;
    }

    range() {
      return this.fuelCap *  this.fuelEfficiency;
    }
  }

  class Auto extends WheeledVehicle {
    constructor() {
      // the array represents tire pressure for four tires
      super([30,30,32,32], 50, 25.0);
    }
  }

  class Motorcycle extends WheeledVehicle {
    constructor() {
      // array represents tire pressure for two tires
      super([20,20], 80, 8.0);
    }
  }

  class Catamaran extends Vehicle {
    constructor(propellerCount, hullCount, kmTravelledPerLiter, fuelCapInLiter) {
      super(kmTravelledPerLiter, fuelCapInLiter);
      // catamaran specific logic

      this.propellerCount = propellerCount;
      this.hullCount = hullCount;
    }
  }
}