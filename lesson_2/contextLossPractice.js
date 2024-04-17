// let obj = {
//   a: 'hello',
//   b: 'world',
//   foo: function() {
//     [1, 2, 3].forEach((number) => {
//       console.log({this: this});
//       console.log(String(number) + ' ' + this.a + ' ' + this.b);
//     });
//   },
// };

// obj.foo();

// => 1 undefined undefined
// => 2 undefined undefined
// => 3 undefined undefined

/** Practice Problems
 * 1. It logs `undefined undefined is a undefined.` (or throws an invalid access error in strict mode).
 *    This is because passing the method as a callback to logReturnVal changes its context from the parent object
 *    (turk) to the global object (or in strict mode, to undefined).
 * 
 * 2. See code below
 */
// function logReturnVal(func, context) {
//   const returnVal = func.call(context);
//   console.log(returnVal);
// }
// logReturnVal(turk.getDescription, turk);
/**
 * 3. Extract getDescription but ensure it always uses turk as its context
 */
// const getDescription = turk.getDescription.bind(turk);
/**
 * 4. It will produce `undefined: <gameName>` for each element in this.titles, because the callback to forEach
 * is executed with global context.
 * 5. Fix the code using self = this
 */
// const TESgames = {
//   titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
//   seriesTitle: 'The Elder Scrolls',
//   listGames: function() {
//     const self = this;
//     this.titles.forEach(function(title) {
//       console.log(self.seriesTitle + ': ' + title);
//     });
//   }
// };
/**
 * 6. Fix the code using the second parameter to forEach
 */
// const TESgames = {
//   titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
//   seriesTitle: 'The Elder Scrolls',
//   listGames: function() {
//     this.titles.forEach(function(title) {
//       console.log(this.seriesTitle + ': ' + title);
//     }, this);
//   }
// };
/**
 * 6. Fix the code using an arrow function
 */
const TESgames = {
  titles: ['Arena', 'Daggerfall', 'Morrowind', 'Oblivion', 'Skyrim'],
  seriesTitle: 'The Elder Scrolls',
  listGames: function() {
    this.titles.forEach((title) => {
      console.log(this.seriesTitle + ': ' + title);
    });
  }
};
// TESgames.listGames();
/**
 * 8. foo.a will be 0, and global.a will be NaN
 * 9. Invoke increment with explicit context
 */
let foo = {
  a: 0,
  incrementA: function() {
    function increment() {
      this.a += 1;
    }

    increment.call(this);
  }
};

foo.incrementA();
foo.incrementA();
foo.incrementA();
// console.log(foo.a)