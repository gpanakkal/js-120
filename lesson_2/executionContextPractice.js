/* eslint-disable no-console */
/**
 * 1. The global object (global or window)
 * 2. `obj` since the function is called as a method of `obj`
 * 3. On line 7, it logs "Hello from the global scope!"
 *    On line 15, it logs "Hello from the function scope!"
 * 4. Function.prototype methods call(), apply(), and bind()
 * 5. bar.add.call(foo) // returns 3
 */

Function.prototype.bind = function (...args) {
  const fn = this;
  const context = args.shift();

  return function (...moreArgs) {
    const allArgs = args.concat(moreArgs);
    return fn.apply(context, allArgs);
  };
};

const foo = {
  a: 54,

  baz() {
    console.log(this);
  },
};

const qux = {
  a: 1,
};

const bound = foo.baz.bind(qux);
bound();

const rebound = bound.bind(foo);
rebound();
console.log(String(bound));
console.log(String(rebound));
