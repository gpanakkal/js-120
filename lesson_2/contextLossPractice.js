const obj = {
  a: 'hello',
  b: 'world',
  foo() {
    const bar = () => {
      console.log(`${this.a} ${this.b}`);
    };

    bar();
  },
};

obj.foo(); // => undefined undefined

// function myFunc() {
//   function bar() {
//     console.log(this.a + ' ' + this.b);
//   }

//   bar();
// }
// myFunc.a = 'good';
// myFunc.b = 'night';
// console.log({ myFunc });
// console.log(myFunc());
