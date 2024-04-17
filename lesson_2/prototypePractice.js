/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
/**
 * 1. Logs 2 to the console because baz is created with qux as its prototype,
 * so accessing baz.foo causes qux.foo to be accessed.
 *
 * 2. Logs 3 to the console because assigning baz.foo creates a property on baz,
 * rather than on its prototype qux.
 *
 * 3. Logs 4 to the console because baz does not have a property foo,
 * so accessing foo leads to walking up the prototype chain and getting qux.foo.
 *
 * 4. Write a function that searches the prototype chain of an object
 * for a given property and assigns it a new value.
 * If the property does not exist in the chain, the function should do nothing.
 *
 * The following code should work as shown:
 *
 * PEDAC
 * Inputs:
 * - an object with a prototype that is an object or null
 * - a property name to reassign
 * - a value to assign to the property
 * Output: Nothing; should assign a new value to the property if the prop exists.
 *
 * Assumptions:
 * - string property names
 * - object has at least one prototype
 *
 * Data structure: n/a
 *
 * Algorithm:
 * - take an object `obj`, a string `keyName`, and any value `value`
 * - Check if the keys of `obj` includes `keyName`
 *   - if true, reassign `obj[keyName]` to `value`
 *   - else check the prototype of `obj`
 *     - if the prototype is null, return
 *     - else recurse on the prototype
 */
{
  function assignProperty(obj, keyName, value) {
    if (Object.keys(obj).includes(keyName)) {
      obj[keyName] = value;
    } else {
      const prototype = Object.getPrototypeOf(obj);
      if (prototype) {
        assignProperty(prototype, keyName, value);
      }
    }
  }

  const fooA = { bar: 1 };
  const fooB = Object.create(fooA);
  const fooC = Object.create(fooB);

  assignProperty(fooC, 'bar', 2);
  console.log(fooA.bar); // 2
  console.log(fooC.bar); // 2
  console.log({ fooA, fooC });

  assignProperty(fooC, 'qux', 3);
  console.log(fooA.qux); // undefined
  console.log(fooC.qux); // undefined
  console.log(Object.hasOwn(fooA, 'qux')); // false
  console.log(Object.hasOwn(fooC, 'qux')); // false
}
/**
 * 5. for...in loops access properties on prototypes while Object.keys() does not.
 * So they often will result in different behavior.
 *
 * 6. Create an object without a prototype with Object.create(null)
 */
