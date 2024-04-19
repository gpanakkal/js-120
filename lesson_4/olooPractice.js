/**
 * 1. Use a factory function to create pet objects
 */
{
  // function createPet(animal, name) {
  //   return {
  //     animal,
  //     name,

  //     sleep: function() {
  //       console.log('I am sleeping');
  //     },

  //     wake: function() {
  //       console.log('I am awake');
  //     },
  //   }
  // }

  // let pudding = createPet("Cat", "Pudding");
  // console.log(`I am a ${pudding.animal}. My name is ${pudding.name}.`);
  // pudding.sleep(); // I am sleeping
  // pudding.wake();  // I am awake

  // let neptune = createPet("Fish", "Neptune");
  // console.log(`I am a ${neptune.animal}. My name is ${neptune.name}.`);
  // neptune.sleep(); // I am sleeping
  // neptune.wake();  // I am awake
}
/**
 * 2. Use OLOO to create an object prototype to create pet objects
 */
{
  const PetPrototype = {
    init(animal, name) {
      this.animal = animal;
      this.name = name;
      return this;
    },

    sleep() {
      console.log('I am sleeping');
    },

    wake() {
      console.log('I am awake');
    },
  };

  let pudding = Object.create(PetPrototype).init("Cat", "Pudding");
  console.log(`I am a ${pudding.animal}. My name is ${pudding.name}.`);
  pudding.sleep(); // I am sleeping
  pudding.wake();  // I am awake

  let neptune = Object.create(PetPrototype).init("Fish", "Neptune");
  console.log(`I am a ${neptune.animal}. My name is ${neptune.name}.`);
  neptune.sleep(); // I am sleeping
  neptune.wake();  // I am awake
}