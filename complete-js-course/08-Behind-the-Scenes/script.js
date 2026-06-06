'use strict';

///////////////////////////////////////
// Scoping in Practice

function calcAge(birthYear) {
  const age = 2037 - birthYear;

  function printAge() {
    // firstname is accessible even if it's defined after the function (because function call is after firstname's definition)
    let output = `${firstName}, you are ${age}, born in ${birthYear}`;
    console.log(output);

    if (birthYear >= 1981 && birthYear <= 1996) {
      // old var type can be accessed outside its block
      var millennial = true;
      // Creating NEW variable with same name as outer scope's variable
      const firstName = 'Steven';

      // Reassigning outer scope's variable
      output = 'NEW OUTPUT!';

      const str = `Oh, and you're a millennial, ${firstName}`;
      console.log(str);

      // functions are also block scoped (strict mode - starting from ES6)
      function add(a, b) {
        return a + b;
      }
    }
    // str is a const and cannot be accessed outside its block:
    // console.log(str);
    // accessing a var outside its block:
    console.log(millennial);
    // console.log(add(2, 3));
    console.log(output); // 'NEW OUTPUT'
  }
  printAge();

  return age;
}

const firstName = 'Jonas';
calcAge(1991);
// console.log(age);
// printAge();

// This shows lexical scoping in action: inner scopes can access and even reassign outer variables,
// `const/let` stay block-scoped, `var` leaks out of blocks, and same-name variables inside a block shadow outer ones.


// ///////////////////////////////////////
// // Hoisting and TDZ in Practice

// Variables
console.log(me);
// console.log(job);
// console.log(year);

var me = 'Jonas';
let job = 'teacher';
const year = 1991;

// Functions
console.log(addDecl(2, 3));
// console.log(addExpr(2, 3));
console.log(addArrow);
// console.log(addArrow(2, 3));

function addDecl(a, b) {
  return a + b;
}

const addExpr = function (a, b) {
  return a + b;
};

var addArrow = (a, b) => a + b;

// Example
console.log(undefined);
if (!numProducts) deleteShoppingCart();

var numProducts = 10;

function deleteShoppingCart() {
  console.log('All products deleted!');
}

var x = 1;
let y = 2;
const z = 3;

console.log(x === window.x);
console.log(y === window.y);
console.log(z === window.z);
// `var` and function declarations are hoisted (with `var` as `undefined`),
// `let/const` are hoisted but inaccessible in the TDZ, and `this` depends on call-site:
// object method call binds `this` to that object, plain function call gives `undefined` (in strict mode),
// and arrow functions inherit surrounding `this`. So we cannot use let/const variables before they are declared (not initialized),
// as we can call the var variables that will return undefined.


///////////////////////////////////////
// The this Keyword in Practice

console.log(this);
// this = window object

const calcAgeThis = function (birthYear) {
  console.log(2037 - birthYear);
  console.log(this);
  // in a regular function, the this keyword will point to undefined
};
calcAgeThis(1991);

const calcAgeArrow = birthYear => {
  console.log(2037 - birthYear);
  console.log(this);
  // in an arrow function the this keyword will point to the surrounding scope (window object)
};
calcAgeArrow(1980);

const charlie = {
  year: 1991,
  calcAge: function () {
    // in a regular function the this keyword will point to the object itself
    console.log(this);
    console.log(2037 - this.year);
  },
};
charlie.calcAge();

const matilda = {
  year: 2017,
};

matilda.calcAge = charlie.calcAge;
matilda.calcAge();

const f = charlie.calcAge;
f();


///////////////////////////////////////
// Regular Functions vs. Arrow Functions

// var firstName = 'Matilda';

const jonas = {
  firstName: 'Jonas',
  year: 1991,
  calcAge: function () {
    // console.log(this);
    console.log(2037 - this.year);

    // Solution 1
    // const self = this; // self or that
    // const isMillenial = function () {
    //   console.log(self);
    //   console.log(self.year >= 1981 && self.year <= 1996);
    // };

    // Solution 2
    const isMillenial = () => {
      console.log(this);
      console.log(this.year >= 1981 && this.year <= 1996);
    };
    isMillenial();
  },

  greet: () => {
    console.log(this);
    console.log(`Hey ${this.firstName}`);
  },
};
jonas.greet();
jonas.calcAge();

// arguments keyword
const addExpr = function (a, b) {
  console.log(arguments);
  return a + b;
};
addExpr(2, 5);
addExpr(2, 5, 8, 12);

var addArrow = (a, b) => {
  console.log(arguments);
  return a + b;
};
addArrow(2, 5, 8);
// Conclusion: Regular methods/functions get their own `this` and `arguments`,
// while arrow functions inherit `this` (and have no own `arguments`), so arrows
// are great for inner callbacks but not for object methods like `greet`.


///////////////////////////////////////
// Object References in Practice (Shallow vs. Deep Copies)

const jessica1 = {
  firstName: 'Jessica',
  lastName: 'Williams',
  age: 27,
};

function marryPerson(originalPerson, newLastName) {
  originalPerson.lastName = newLastName;
  return originalPerson;
}

const marriedJessica = marryPerson(jessica1, 'Davis');

console.log('Before:', jessica1);
console.log('After:', marriedJessica);

const jessica = {
  firstName: 'Jessica',
  lastName: 'Williams',
  age: 27,
  family: ['Alice', 'Bob'],
};

// Shallow copy
const jessicaCopy = { ...jessica };
jessicaCopy.lastName = 'Davis';

jessicaCopy.family.push('Mary');
jessicaCopy.family.push('John');

console.log('Before:', jessica);
console.log('After:', jessicaCopy);
// references inside the original object will just be passed to the new object,
// so any changes to the family array will affect both objects

// Deep copy/clone
const jessicaClone = structuredClone(jessica);
jessicaClone.family.push('Alex');
jessicaClone.family.push('Barbara');

console.log('Original:', jessica);
console.log('Clone:', jessicaClone);
// with the structuredClone method, a deep copy of the object is created, so any changes to the clone
// won't affect the original object (this method is not supported on older browsers
