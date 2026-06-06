// let is the new var
// strings can be written with single or double quotes
let firstName = "CC"

// number data type
let PI = 3.1415

// boolean data type
let isFun = true

// undefined data type
let x, y;

// assigning values to undefined variables
x = y = 10

// null data type
// symbol data type
// BigInt data type
// in JS the value has a type, not the variable

console.log(typeof isFun)

// const = immutable (need to assign a value) (IDE will not )
const birthYear = 2020;
// usually it would be good to declare const and keep let only for variables that we know should mutate
// if we define a variable without let, var or const (it is possible) then we create a global variable for the global object


firstName = "John"
const job = "teacher"
const concatenated = "I,m " + firstName + " and I'm a " + job
const concatenatedV2 = `I'm ${firstName} and I'm a ${job}`
console.log(concatenatedV2)


const someNumberAsString = '2000';
const convertedString = Number(someNumberAsString);
console.log(typeof convertedString);

// there is also NaN values (strangely, they are mapped as number type, although there are invalid numbers
console.log(Number('John'))
console.log(typeof NaN)

// type coercion
console.log("I'm " + 10 + " years old.");
// another strange bit of JS
console.log('23' + '10' - 3)
console.log('23' - '10' - 3)
// because + is an operator also used for concatenation, type coercion will not work
// other mathematical operations should coerce the str to number

// 0, '', undefined, null and NaN will be converted to boolean false
// they are called falsey values



// for equality, we should only use the triple equality operator
if (4 == '4') console.log('loosely equal');
if (4 == 4) console.log('loosely equal');
if (4 !== '4') console.log('strictly not equal');
if (4 === 4) console.log('strictly equal');

// logical operators: &&, ||, !


// ------------------ Conditional logic

const js = "amazing";

if (js === "amazing") {
    console.log("Fun!");
} else if (js === "not amazing") {
    console.log("Not amazing!");
} else {
    console.log("Something else...");
}
console.log(js);


const dayOfWeek = "Monday"

switch(dayOfWeek) {
    case "Monday":
        console.log("It's Monday");
        break;
    case "Tuesday":
        console.log("It's Tuesday");
        break;
    case "Saturday":
    case "Sunday":
        console.log("It's weekend");
        break;
    default:
        console.log("Second part of the working week");
}


const age = 21;
age >= 18 ? console.log("Can drink wine") : console.log("Can't drink wine");



