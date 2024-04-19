/**
 * 1. Logs 'Hello!'
 * 2. Throws TypeError for nonexistent method
 * 3. Logs undefined to the console
 * 4. Logs 'Goodbye'
 * 5. Throws TypeError for nonexistent method
 */
/**
 * 1. It overrides the method of the parent class
 * 2. Create a class hierarchy:
 * Create a class named Greeting that has a single method named greet. The method should take a string argument, and it should print that argument to the console.
 * Now, create two more classes that inherit from Greeting: one named Hello, and the other Goodbye. The Hello class should have a hi method that takes no arguments and logs "Hello". The Goodbye class should have a bye method that logs "Goodbye". Use the greet method from the Greeting class when implementing Hello and Goodbye; don't call console.log from either Hello or Goodbye.
 */
/**
 * 
 */
class Greeting {
  constructor() {}

  greet(str) {
    console.log(str);
  }
}

class Hello extends Greeting {
  hi() {
    this.greet('Hello');
  }
}

class Goodbye extends Greeting {
  bye() {
    this.greet('Goodbye');
  }
}