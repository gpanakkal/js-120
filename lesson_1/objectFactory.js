const { printTestResults } = require('../testing/testingFunctions');
{
  function createCar(make, fuelLevel, engineOn) {
    return {
      make,
      fuelLevel,
      engineOn,
      startEngine() {
        this.engineOn = true;
      },
    
      drive() {
        this.fuelLevel -= 0.1;
      },
    
      stopEngine() {
        this.engineOn = false;
      },
    
      refuel(percent) {
        if ((this.fuelLevel + (percent / 100)) <= 1) {
          this.fuelLevel += (percent / 100);
        } else {
          this.fuelLevel = 1;
        }
      },
    }
  }

  let raceCar1 = createCar('BMW', 0.5, false);
  raceCar1.drive();

  let raceCar2 = createCar('Ferrari', 0.7, true);
  raceCar2.drive();

  let raceCar3 = createCar('Jaguar', 0.4, false);

  // console.log({raceCar1, raceCar2, raceCar3})
}
{
  function createBook(title, author, read = false) {
    return {
      title,
      author,
      read,

      getDescription() {
        return `${this.title} was written by ${this.author}. I ${this.read ? 'have' : "haven't"} read it`;
      },

      readBook() {
        this.read = true;
      }
    }
  }

  const examples = [
    {
      in: ['Mythos', 'Stephen Fry'],
      out: {title: 'Mythos', author: 'Stephen Fry'},
    },
    {
      in: ['Me Talk Pretty One Day', 'David Sedaris'],
      out: {title: 'Me Talk Pretty One Day', author: 'David Sedaris'},
    },
  ];
  // printTestResults(examples, createBook);
  // console.log(createBook(...examples[0].in).getDescription())
}