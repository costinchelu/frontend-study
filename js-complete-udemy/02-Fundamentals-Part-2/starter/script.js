// activating strict mode
'use strict'


// ------------------- Functions

// classic function can be called even before defining it in the file
console.log(`Juice: ${juiceProcessor(3, 2)}`);

function cutFruit(fruit) {
    return fruit * 4;
}

function juiceProcessor(apples, oranges) {
    apples = cutFruit(apples)
    oranges = cutFruit(oranges)
    console.log(apples, oranges);
    return `Juice with ${apples} apples and ${oranges} oranges`
}

// function expression
const varFunction = function (year) {
    return 2100 - year;
}

// arrow function expression
const retirement = (birthYear, firstName) => {
    const age = 2026 - birthYear;
    const retirement = 65 - age;
    return `${firstName} retires in ${retirement} years.`;
}

console.log(retirement(2000, "John"));

// ------------------------ Arrays & objects

const varArray = [
    "Michael",
    19,
    [true, false, false],
    retirement(2000, "Michael")
];
varArray.push("John")

console.log(varArray)
console.log(varArray.shift());
console.log(varArray.includes("Michael"));
console.log(varArray.unshift("Adam"));
console.log(varArray.pop());
console.log(varArray.indexOf("Adam"));
console.log(varArray);

// in an object the order doesn't matter (it's a dictionary/map)
const johnDoe = {
    firstName: "John",
    lastName: "Doe",
    birthYear: 1990,
    job: "teacher",
    friends: ["Michael", "Sarah", "Steven"],

    calcAge: function (year) {
        return year - this.birthYear;
    }
};

console.table(johnDoe);
console.log(johnDoe.firstName);
console.log(johnDoe["lastName"]);
johnDoe.newProp = "new prop"
console.table(johnDoe);
johnDoe.friends[1] = "Shawn"
console.table(johnDoe);
console.log(johnDoe.calcAge(2026));


// ------------------------ Loops

const types = [];

for (let i = 0; i < varArray.length; i++) {
    console.log(varArray[i], typeof varArray[i]);
    types[i] = typeof varArray[i];
}

let i = 1;
while (i < 6) {
    console.log(`Repetition: ${i}`);
    i++;
}

const diceValues = [];
while (true) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceValues.push(dice);
    if (dice === 6) break;
}
console.log(diceValues);