'use strict';


///////////////////////////////////////
// Default Parameters

const bookings = [];

const createBooking = function (
  flightNum,
  numPassengers = 1,
  price = 199 * numPassengers
) {
  // old ES5 way:
  // numPassengers = numPassengers || 1;
  // price = price || 199;

  const booking = {
    flightNum,
    numPassengers,
    price,
  };
  console.log(booking);
  bookings.push(booking);
};

createBooking('LH123');
createBooking('LH123', 2, 800);
createBooking('LH123', 2);
createBooking('LH123', 5);

createBooking('LH123', undefined, 1000);


///////////////////////////////////////
// How Passing Arguments Works: Values vs. Reference

const flight = 'LH234';
const jonas = {
  name: 'Jonas Schmedtmann',
  passport: 24739479284,
};

// variable flight is a primitive
// it is passed by value so only a copy of it is passed to the function
// the original variable will remain unchanged
// passenger will be modified as we are passing the actual address of the object found in the heap
// we are simply copying that address from the stack, but it will be the same address of the actual object from the heap
const checkIn = function (flightNum, passenger) {
  flightNum = 'LH999';
  passenger.name = 'Mr. ' + passenger.name;

  if (passenger.passport === 24739479284) {
    console.log('Checked in');
  } else {
    console.log('Wrong passport!');
  }
};

// checkIn(flight, jonas);
// console.log(flight);
// console.log(jonas);

// Is the same as doing...
// const flightNum = flight;
// const passenger = jonas;

// passing by value may create some confusion in large codebase
// here the actual property of the passed object will be modified.
// even though JS is a pass by value language, the reference of the object (in stack) is passed
// when we change a property, that will remain changed for the original object as the change will be made in the heap
const newPassport = function (person) {
  person.passport = Math.trunc(Math.random() * 100000000000);
};

newPassport(jonas);
checkIn(flight, jonas);


///////////////////////////////////////
// Functions Accepting Callback Functions

// in JS functions are first-class citizens
// here, functions are actually objects, and also objects in JS are values
// so functions can be passed as arguments to other functions as normal values
const oneWord = function (str) {
  return str.replace(/ /g, '').toLowerCase();
};

const upperFirstWord = function (str) {
  const [first, ...others] = str.split(' ');
  return [first.toUpperCase(), ...others].join(' ');
};

// Higher-order function
// transformer is considered a higher order function as it can receive other functions as arguments
// but higher order functions are functions that operate on other functions, either by taking them as arguments or by returning them
// here, fn is a function that will be executed by transformer and in this case fn will be considered a callback function
// because will be called later by the higher order function
const transformer = function (str, fn) {
  console.log(`Original string: ${str}`);
  console.log(`Transformed string: ${fn(str)}`);

  console.log(`Transformed by: ${fn.name}`);
};

transformer('JavaScript is the best!', upperFirstWord);
transformer('JavaScript is the best!', oneWord);

// JS uses callbacks all the time
const high5 = function () {
  console.log('👋');
};
document.body.addEventListener('click', high5);
['Jonas', 'Martha', 'Adam'].forEach(high5);


///////////////////////////////////////
// Functions Returning Functions

// greet is still considered a higher order function because it returns another function
const greet = function (greeting) {
  return function (name) {
    console.log(`${greeting} ${name}`);
  };
};

const greeterHey = greet('Hey');
greeterHey('Jonas');
greeterHey('Steven');

greet('Hello')('Jonas');

// arrow function returning an arrow function
const greetArr = greeting => name => console.log(`${greeting} ${name}`);

greetArr('Hi')('Jonas');


///////////////////////////////////////
// The call and apply Methods

const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],
  // book: function() {}
  book(flightNum, name) {
    console.log(
      `${name} booked a seat on ${this.airline} flight ${this.iataCode}${flightNum}`
    );
    this.bookings.push({ flight: `${this.iataCode}${flightNum}`, name });
  },
};

lufthansa.book(239, 'Jonas Schmedtmann');
lufthansa.book(635, 'John Smith');

const eurowings = {
  airline: 'Eurowings',
  iataCode: 'EW',
  bookings: [],
};


// eurowings.book(23, 'Sarah Williams');
// Does NOT work (as book method is not defined in the eurowings object)
// duplicating the book method would be bad practice
// as functions are values in JS, we can store the lufthansa.book() method in a variable

const book = lufthansa.book;
// now, as book is now a function and not a method, there will be no "this"
// we will need to use it by calling the book() method
// there are 3 functions that can be used: call, apply and bind

// Call method (first argument will be the object used for "this")
// call, will call luftansa.book method with "this" keyword pointed to the eurowings object
book.call(eurowings, 23, 'Sarah Williams');
console.log(eurowings);

book.call(lufthansa, 239, 'Mary Cooper');
console.log(lufthansa);

const swiss = {
  airline: 'Swiss Air Lines',
  iataCode: 'LX',
  bookings: [],
};

book.call(swiss, 583, 'Mary Cooper');

// Apply method (not so used anymore)
const flightData = [583, 'George Cooper'];
book.apply(swiss, flightData);
console.log(swiss);

// now, instead of using apply we can use call with the spread operator for the function arguments
book.call(swiss, ...flightData);


///////////////////////////////////////
// The bind Method
// book.call(eurowings, 23, 'Sarah Williams');

// bind it is not calling the function but returns another function where the "this" keyword is bind to a certain object
const bookEW = book.bind(eurowings);
const bookLH = book.bind(lufthansa);
const bookLX = book.bind(swiss);

bookEW(23, 'Steven Williams');

// we can even pass multiple arguments (that will be "set in stone" for that function)
// partial application pattern
const bookEW23 = book.bind(eurowings, 23);
bookEW23('Jonas Schmedtmann');
bookEW23('Martha Cooper');

// when we use objects together with event listeners
lufthansa.planes = 300;
// add new method only to lufthansa object
lufthansa.buyPlane = function () {
  console.log(this);
  this.planes++;
  console.log(this.planes);
};
// if we call:
// lufthansa.buyPlane();
// the this keyword is lufthansa

// adding the event handler to the page:
// <button class="buy">Buy new plane 🛩</button>
// we cannot call buyPlane it the same as here: lufthansa.buyPlane() as now, the this keyword is actually pointing to .querySelector('.buy') as actually the eventListener is calling the function
// so we need to bind it to the lufthansa object
document
  .querySelector('.buy')
  .addEventListener('click', lufthansa.buyPlane.bind(lufthansa));

// Partial application (preset parameters)
const addTax = (rate, value) => value + value * rate;
console.log(addTax(0.1, 200));

const addVAT = addTax.bind(null, 0.23);
// addVAT = value => value + value * 0.23;

console.log(addVAT(100));
console.log(addVAT(23));

// another method:
const addTaxRate = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};
// apply addTaxRate for a fixed rate of 23% (VAT)
const addVAT2 = addTaxRate(0.23);
// call the new function (addVAT2) with the desired value:
console.log(addVAT2(100));
console.log(addVAT2(23));


///////////////////////////////////////
// Immediately Invoked Function Expressions (IIFE)

// what if we need a function that needs to be called once:
const runOnce = function () {
  console.log('This will never run again');
};
// ...actually we can run it multiple times:
runOnce();
runOnce();


// IIFE
// we are tricking JS into thinking that this is just an expression by wrapping the function into round brackets and then adding () in order to call it
// it's not a JS feature, but more of a pattern
(function () {
  console.log('This will never run again');
  const isPrivate = 23;
})();

// data encapsulation
// global scope cannot access inner scopes:
// console.log(isPrivate);

// also works for arrow functions:
(() => console.log('This will ALSO never run again'))();

{
  const isPrivate = 23;
  var notPrivate = 46;
}
// console.log(isPrivate);
console.log(notPrivate);


///////////////////////////////////////
// Closures

const secureBooking = function () {
  let passengerCount = 0;

  return function () {
    passengerCount++;
    console.log(`${passengerCount} passengers`);
  };
};

// for getting the return value of secureBooking function (which is the inner function)
const booker = secureBooking();

booker();
booker();
booker();
// unexpectedly, passengerCount will increment every time
// once secureBooking is created in the global scope (stack), will be moved to the heap
// booker function will be called from the stack, but it will still have access to secureBooking in the heap
// if an object is reachable by a closure (like secureBooking), it cannot be garbage collected

// get details about the function (we can check function's scopes):
console.dir(booker);


///////////////////////////////////////
// More Closure Examples

// Example 1
// even when f variable is defined outside the g function, we will still have a closure as we assign f to the inner function
let f;

const g = function () {
  const a = 23;
  f = function () {
    console.log(a * 2);
  };
};

const h = function () {
  const b = 777;
  f = function () {
    console.log(b * 2);
  };
};

g();
f();
console.dir(f);

// Re-assigning f function will also change the closure scope
h();
f();
console.dir(f);

// Example 2
const boardPassengers = function (n, wait) {
  const perGroup = n / 3;

  setTimeout(function () {
    console.log(`We are now boarding all ${n} passengers`);
    console.log(`There are 3 groups, each with ${perGroup} passengers`);
  }, wait * 1000);

  console.log(`Will start boarding in ${wait} seconds`);
};

const perGroup = 1000;
boardPassengers(180, 3);


///////////////////////////////////////
// Coding Challenge #1

/* 
Let's build a simple poll app!

A poll has a question, an array of options from which people can choose, and an array with the number of replies for each option. This data is stored in the starter object below.

Here are your tasks:

1. Create a method called 'registerNewAnswer' on the 'poll' object. The method does 2 things:
  1.1. Display a prompt window for the user to input the number of the selected option. The prompt should look like this:
        What is your favourite programming language?
        0: JavaScript
        1: Python
        2: Rust
        3: C++
        (Write option number)
  
  1.2. Based on the input number, update the answers array. For example, if the option is 3, increase the value AT POSITION 3 of the array by 1. Make sure to check if the input is a number and if the number makes sense (e.g answer 52 wouldn't make sense, right?)
2. Call this method whenever the user clicks the "Answer poll" button.
3. Create a method 'displayResults' which displays the poll results. The method takes a string as an input (called 'type'), which can be either 'string' or 'array'. If type is 'array', simply display the results array as it is, using console.log(). This should be the default option. If type is 'string', display a string like "Poll results are 13, 2, 4, 1". 
4. Run the 'displayResults' method at the end of each 'registerNewAnswer' method call.

HINT: Use many of the tools you learned about in this and the last section 😉

BONUS: Use the 'displayResults' method to display the 2 arrays in the test data. Use both the 'array' and the 'string' option. Do NOT put the arrays in the poll object! So what shoud the this keyword look like in this situation?

BONUS TEST DATA 1: [5, 2, 3]
BONUS TEST DATA 2: [1, 5, 3, 9, 6, 1]
*/

/*
const poll = {
  question: 'What is your favourite programming language?',
  options: ['0: JavaScript', '1: Python', '2: Rust', '3: C++'],
  // This generates [0, 0, 0, 0]. More in the next section 😃
  answers: new Array(4).fill(0),
  registerNewAnswer() {
    // Get answer
    const answer = Number(
      prompt(
        `${this.question}\n${this.options.join('\n')}\n(Write option number)`
      )
    );
    console.log(answer);

    // Register answer
    typeof answer === 'number' &&
      answer < this.answers.length &&
      this.answers[answer]++;

    this.displayResults();
    this.displayResults('string');
  },

  displayResults(type = 'array') {
    if (type === 'array') {
      console.log(this.answers);
    } else if (type === 'string') {
      // Poll results are 13, 2, 4, 1
      console.log(`Poll results are ${this.answers.join(', ')}`);
    }
  },
};

document
  .querySelector('.poll')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

poll.displayResults.call({ answers: [5, 2, 3] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');
poll.displayResults.call({ answers: [1, 5, 3, 9, 6, 1] });

// [5, 2, 3]
// [1, 5, 3, 9, 6, 1]

*/

///////////////////////////////////////
// Coding Challenge #2

/* 
This is more of a thinking challenge than a coding challenge 🤓

Take the IIFE below and at the end of the function, attach an event listener that changes the color of the selected h1 element ('header') to blue, each time the BODY element is clicked. Do NOT select the h1 element again!

And now explain to YOURSELF (or someone around you) WHY this worked! Take all the time you need. Think about WHEN exactly the callback function is executed, and what that means for the variables involved in this example.
*/

/*
(function () {
  const header = document.querySelector('h1');
  header.style.color = 'red';

  document.querySelector('body').addEventListener('click', function () {
    header.style.color = 'blue';
  });
})();
*/

