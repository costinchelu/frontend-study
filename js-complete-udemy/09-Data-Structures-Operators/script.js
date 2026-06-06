'use strict';


const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const openingHours = {
  [weekdays[3]]: {
    open: 12,
    close: 22,
  },
  [weekdays[4]]: {
    open: 11,
    close: 23,
  },
  [weekdays[5]]: {
    open: 0, // Open 24 hours
    close: 24,
  },
};

const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  // ES6 enhanced object literals (simply add the variable (object) and a new property with the same name will be created for the restaurant object literal)
  openingHours,

  // ES6 = we an also write functions without assigning a variable to them:
  // old way: order: function(startIndex, mainIndex) {}
  order(starterIndex, mainIndex) {
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery({ starterIndex = 1, mainIndex = 0, time = '20:00', address }) {
    console.log(
      `Order received! ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]} will be delivered to ${address} at ${time}`
    );
  },

  orderPasta(ing1, ing2, ing3) {
    console.log(
      `Here is your delicious pasta with ${ing1}, ${ing2} and ${ing3}`
    );
  },

  orderPizza(mainIngredient, ...otherIngredients) {
    console.log(mainIngredient);
    console.log(otherIngredients);
  },
};


///////////////////////////////////////
// Destructuring

// destructuring an array:
let [first, , third] = restaurant.categories;
console.log(first, third);
// the original array will remain untouched

// we can even exchange the variable values using destructuring
[third, first] = [first, third];
console.log(first, third);

// function using destructuring:
const [order1starter, order1main] = restaurant.order(2, 1)
console.log(order1starter, order1main);

// destructuring works even for nested arrays:
const nested = [2, 3, [4, 5]];
const [n1, , [n3, n4]] = nested
console.log(n1, n3, n4);

// we can set default values for elements that don't exist
const [el1 = 0, el2 = 0, el3 = 0] = [8, 9]
console.log(el1, el2, el3);

// we can also destructure objects ()
// for mainMenu we can also set a default value
// for location and categories we can even change the property name
const {
  name,
  location: address,
  categories: tags,
  starterMenu,
  mainMenu = []
} = restaurant;

console.log(name, ":", address);
console.log(tags);
console.log(mainMenu);

// calling method using an object as argument
restaurant.orderDelivery(
  {
    starterIndex: 2,
    mainIndex: 2,
    time: "22:30",
    address: "Via del Sole, 21"
  }
);


///////////////////////////////////////
// Spread operator

// spread operator, copy array
const arr1 = [1, 2, 3];
const arr2 = [-1, 0, ...arr1];
console.log(arr2);
// we can pass the elements (not the array) to a function using the spread operator:
console.log(...arr2);
const newMainMenu = [...restaurant.mainMenu, "Gnochi"];
console.log(newMainMenu);

// shallow copy of an array
const mainMenuCopy = [...restaurant.mainMenu];
const joinedMenu = [...restaurant.starterMenu, ...restaurant.mainMenu];
console.log(joinedMenu);

// spread operator can also be used as function arguments
// can also create new objects using old ones:
const newRestaurant = {
  foundedIn: 2000,
  ...restaurant,
  founder: "Giuseppe"
};
console.log(newRestaurant);


///////////////////////////////////////
// Rest Pattern and Parameters

// can also be used on the left side of the equal operator (rest pattern):
const [rest1, rest2, ...restOthers] = [1, 2, 3, 4, 5];
console.log(rest1, rest2, restOthers);


///////////////////////////////////////
// Short Circuiting (&& and ||)

console.log('---- OR ----');
// Use ANY data type, return ANY data type, short-circuiting
// Java only supports boolean (or expressions in ternary operator)
// System.out.println(false || true)
// OR, returns the first thrutly value even if just one of them is thruthly (or else returns the first falsey value)
console.log(3 || 'Jonas');
console.log('' || 'Jonas');
console.log(true || 0);
console.log(undefined || null);

console.log(undefined || 0 || '' || 'Hello' || 23 || null);

restaurant.numGuests = 0;
const guests1 = restaurant.numGuests ? restaurant.numGuests : 10;
console.log(guests1);

const guests2 = restaurant.numGuests || 10;
console.log(guests2);

console.log('---- AND ----');
// returns the last thruthly value if both values are truthly or else returns the first falsey value
console.log(0 && 'Jonas');
console.log(7 && 'Jonas');

console.log('Hello' && 23 && null && 'jonas');

// Practical example (check if method exists)
if (restaurant.orderPizza) {
  restaurant.orderPizza('mushrooms', 'spinach');
}

// alternative to if (using &&)
// in this case as orderPizza exists, then it proceeding with the second part of the expression (calling the function)
restaurant.orderPizza && restaurant.orderPizza('mushrooms', 'spinach');


///////////////////////////////////////
// The Nullish Coalescing Operator

restaurant.numGuests = 0;
const guests = restaurant.numGuests || 10;
console.log(guests);
// the problem of using || short circuiting is that in case numGuests is having a falsey value (like 0) then the second part of the expression is taken
// for this cases we are better off using the coalescing operator, and in this case 0 or '' will not be treated as falsey and only nullish values will return the second part of the expression

// Nullish: null and undefined (NOT 0 or '')
const guestCorrect = restaurant.numGuests ?? 10;
console.log(guestCorrect);


///////////////////////////////////////
// Logical Assignment Operators
const rest3 = {
  name: 'Capri',
  // numGuests: 20,
  numGuests: 0,
};

const rest4 = {
  name: 'La Piazza',
  owner: 'Giovanni Rossi',
};

// OR assignment operator - the problem of assigning a property and a default value if the object doesn't have that property (short circuiting will work)
// rest3.numGuests = rest3.numGuests || 10;
// rest4.numGuests = rest4.numGuests || 10;

// or better use the OR assignment operator (shorter expression):
// rest3.numGuests ||= 10;
// rest4.numGuests ||= 10;
// in the end, this is still not the perfect aproach because like in the case of short circuing OR, in case we have numGuests as 0, 
// next time it will be considered a falsey value and displaced by the second part of the expression (value 10)

// NULLISH assignment operator (null or undefined) - will be better suited for the cases when we can have numGuests: 0
rest3.numGuests ??= 10;
rest4.numGuests ??= 10;

// AND assignment operator (as rest1 doesn't have an owner, the first falsey value is assigned as undefined)
// rest3.owner = rest3.owner && '<ANONYMOUS>';
// rest4.owner = rest4.owner && '<ANONYMOUS>';

// using the AND assignment operator will produce the same result for rest4, but rest3 will not get the new owner property (so only thruthy values will be assigned)
rest3.owner &&= '<ANONYMOUS>';
rest4.owner &&= '<ANONYMOUS>';

console.log(rest3);
console.log(rest4);


///////////////////////////////////////
// The for-of Loop
const menu = [...restaurant.starterMenu, ...restaurant.mainMenu];

// looping over each element of the menu array and accesing that element through variable item
for (const item of menu) console.log(item);

// we can get each element of the menu array and the index of it
for (const [i, el] of menu.entries()) {
  console.log(`${i + 1}: ${el}`);
}

// if we want the entries, we can get it as an array of arrays of 2 elements (index and value)
// console.log([...menu.entries()]);


///////////////////////////////////////
// Optional Chaining
if (restaurant.openingHours && restaurant.openingHours.mon)
  console.log(restaurant.openingHours.mon.open);

// console.log(restaurant.openingHours.mon.open);

// WITH optional chaining
// ? operator works as the nullable operator in Kotlin
console.log(restaurant.openingHours.mon?.open);
// if opening hours is not null, then if mon is not null, check the open property:
console.log(restaurant.openingHours?.mon?.open);


// it works even for the variables (day is not an element of openingHours, but, mon, tue ... etc is so in this case we are putting it in brackets)
// we can still use optional chaining for it
// obs we use the nullish assignement operator ?? 'closed' as some days we are opening at 0, which is a falsey value (and closed will be selected, which is not accurate)
for (const day of weekdays) {
  const open = restaurant.openingHours[day]?.open ?? 'closed';
  console.log(`On ${day}, we open at ${open}`);
}

// optional chaining is also working on methods (method orderRisotto is undefined)
console.log(restaurant.order?.(0, 1) ?? 'Method does not exist');
console.log(restaurant.orderRisotto?.(0, 1) ?? 'Method does not exist');

// Arrays
const users = [{ name: 'Jonas', email: 'hello@jonas.io' }];
// const users = [];

// without optional chaining:
if (users.length > 0) console.log(users[0].name);
else console.log('user array empty');

// with optional chaining
console.log(users[1]?.name ?? 'No user with the required index');


///////////////////////////////////////
// Looping Objects: Object Keys, Values, and Entries

// Property NAMES
const objProperties = Object.keys(openingHours);
console.log(objProperties);

let openStr = `We are open on ${objProperties.length} days: `;
for (const day of objProperties) {
  openStr += `${day}, `;
}
console.log(openStr);

// Property VALUES
const objValues = Object.values(openingHours);
console.log(objValues);

// ENTIRE object
const objectEntries = Object.entries(openingHours);
// console.log(entries);

// destructuring entries [key, value]
for (const [day, { open, close }] of objectEntries) {
  console.log(`On ${day} we open at ${open} and close at ${close}`);
}


///////////////////////////////////////
// Sets

// create a set from an array
const ordersSet = new Set([
  'Pasta',
  'Pizza',
  'Pizza',
  'Risotto',
  'Pasta',
  'Pizza',
]);
console.log(ordersSet);

// create a set with an element
console.log(new Set('Jonas'));

// methods and operations for a set:
console.log(ordersSet.size);
console.log(ordersSet.has('Pizza'));
console.log(ordersSet.has('Bread'));
ordersSet.add('Garlic Bread');
ordersSet.add('Garlic Bread');
ordersSet.delete('Risotto');
// ordersSet.clear();
console.log(ordersSet);

for (const order of ordersSet) console.log(order);


const staff = ['Waiter', 'Chef', 'Waiter', 'Manager', 'Chef', 'Waiter'];
// remove duplicates and save them in a new array using the spread operator
// as we cannot retrieve data from a set by its index, we are better off saving it as an array
const staffUnique = [...new Set(staff)];
console.log(staffUnique);

console.log(
  new Set(['Waiter', 'Chef', 'Waiter', 'Manager', 'Chef', 'Waiter']).size
);

// as  string is also an iterable, we can use the size property:
console.log(new Set('jonasschmedtmann').size);


///////////////////////////////////////
// New Operations to Make Sets Useful!

const italianFoods = new Set([
  'pasta',
  'gnocchi',
  'tomatoes',
  'olive oil',
  'garlic',
  'basil',
]);

const mexicanFoods = new Set([
  'tortillas',
  'beans',
  'rice',
  'tomatoes',
  'avocado',
  'garlic',
]);

// mathematical sets (Venn):

// another set with common elements from both sets
const commonFoods = italianFoods.intersection(mexicanFoods);
console.log('Intersection:', commonFoods);
console.log([...commonFoods]);

// another set with all unique elements from both sets
const italianMexicanFusion = italianFoods.union(mexicanFoods);
console.log('Union:', italianMexicanFusion);

console.log([...new Set([...italianFoods, ...mexicanFoods])]);

// elements unique in the first set but not in second
const uniqueItalianFoods = italianFoods.difference(mexicanFoods);
console.log('Difference italian', uniqueItalianFoods);

const uniqueMexicanFoods = mexicanFoods.difference(italianFoods);
console.log('Difference mexican', uniqueMexicanFoods);

// opposite of the intersection method
const uniqueItalianAndMexicanFoods = italianFoods.symmetricDifference(mexicanFoods);
console.log(uniqueItalianAndMexicanFoods);

// check if sets have a completely different composition 
// (in this case will be false)
console.log(italianFoods.isDisjointFrom(mexicanFoods));


///////////////////////////////////////
// Maps: Fundamentals

const restMap = new Map();
// set key-value pairs to restMap
restMap.set('name', 'Classico Italiano');
restMap.set(1, 'Firenze, Italy');
console.log(restMap.set(2, 'Lisbon, Portugal'));

// chain the set command
restMap
  .set('categories', ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'])
  .set('open', 11)
  .set('close', 23)
  .set(true, 'We are open :D')
  .set(false, 'We are closed :(');

  // get value by key
console.log(restMap.get('name'));
console.log(restMap.get(true));
console.log(restMap.get(1));

// smart way to get an open/closed message using comparison to get true or false 
const time = 8;
console.log(
  restMap.get(
    time > restMap.get('open') && 
    time < restMap.get('close')
  )
);

// other methods (like in the sets)
console.log(restMap.has('categories'));
restMap.delete(2);
// rest.clear();

const arrAsKey = [1, 2];
restMap.set(arrAsKey, 'Test arr');
restMap.set(document.querySelector('h1'), 'Heading');
console.log(restMap);
console.log(restMap.size);

console.log(restMap.get(arrAsKey));

// document exists only in the browser.


///////////////////////////////////////
// Maps: Iteration

// can construct a map using an array of arrays (with 2 elements for KV)
const question = new Map([
  ['question', 'What is the best programming language in the world?'],
  [1, 'C'],
  [2, 'Java'],
  [3, 'JavaScript'],
  ['correct', 3],
  [true, 'Correct 🎉'],
  [false, 'Try again!'],
]);
console.log(question);

// Convert object to map
console.log(Object.entries(openingHours));
const hoursMap = new Map(Object.entries(openingHours));
console.log(hoursMap);

// maps are also iterables
console.log(question.get('question'));
for (const [key, value] of question) {
  if (typeof key === 'number') console.log(`Answer ${key}: ${value}`);
}

// const answer = Number(prompt('Your answer'));
const answer = 3;
console.log(answer);

console.log(question.get(question.get('correct') === answer));

// Convert map to array (get back the array of arrays)
console.log([...question]);

// console.log(question.entries());
console.log([...question.keys()]);
console.log([...question.values()]);


///////////////////////////////////////
// Working With Strings - Part 1

const airline = 'TAP Air Portugal';
let plane = 'A320';

// strings are iterables (can check letters by index)
console.log(plane[0]);
console.log(plane[1]);
console.log(plane[2]);
console.log('B737'[0]);

console.log(airline.length);
console.log('B737'.length);

console.log(airline.indexOf('r'));
console.log(airline.lastIndexOf('r'));
console.log(airline.indexOf('portugal')); // -1 as it is case-sensitive

// slice
console.log(airline.slice(4));
console.log(airline.slice(4, 7)); // 'Air'

console.log(airline.slice(0, airline.indexOf(' '))); // 'TAP'
console.log(airline.slice(airline.lastIndexOf(' ') + 1)); // 'Portugal'

console.log(airline.slice(-2)); // 'al'
console.log(airline.slice(1, -1)); // 'AP Air Portuga'


const checkMiddleSeat = function (seat) {
  // B and E are middle seats
  const s = seat.slice(-1);
  if (s === 'B' || s === 'E') console.log('You got the middle seat 😬');
  else console.log('You got lucky 😎');
};

checkMiddleSeat('11B');
checkMiddleSeat('23C');
checkMiddleSeat('3E');

// 
console.log(new String('jonas'));
console.log(typeof new String('jonas'));

console.log(typeof new String('jonas').slice(1));


///////////////////////////////////////
// Working With Strings - Part 2

console.log(airline.toLowerCase());
console.log(airline.toUpperCase());

// Fix capitalization in name
const passenger = 'jOnAS'; // Jonas
const passengerLower = passenger.toLowerCase();
const passengerCorrect = passengerLower[0].toUpperCase() + passengerLower.slice(1);
console.log(passengerCorrect);

const correctName = function (name) {
  return name[0].toUpperCase() + name.toLowerCase().slice(1);
}
console.log(correctName(passenger));

// Comparing emails
const email = 'hello@jonas.io';
const loginEmail = '  Hello@Jonas.Io \n';

// const lowerEmail = loginEmail.toLowerCase();
// const trimmedEmail = lowerEmail.trim();
const normalizedEmail = loginEmail.toLowerCase().trim();
console.log(normalizedEmail);
console.log(email === normalizedEmail);

// replacing
const priceGB = '288,97£';
const priceUS = priceGB.replace('£', '$').replace(',', '.');
console.log(priceUS);

const announcement = 'All passengers come to boarding door 23. Boarding door 23!';

console.log(announcement.replace('door', 'gate'));
console.log(announcement.replaceAll('door', 'gate'));

// Alternative solution to replaceAll with regular expression
console.log(announcement.replace(/door/g, 'gate'));

// Booleans
plane = 'Airbus A320neo';
console.log(plane.includes('A320'));
console.log(plane.includes('Boeing'));
console.log(plane.startsWith('Airb'));

if (plane.startsWith('Airbus') && plane.endsWith('neo')) {
  console.log('Part of the NEW AIRBUS family');
}

// Practice exercise
const checkBaggage = function (items) {
  const baggage = items.toLowerCase();

  if (baggage.includes('knife') || baggage.includes('gun')) {
    console.log('You are NOT allowed on board');
  } else {
    console.log('Welcome aboard!');
  }
};

checkBaggage('I have a laptop, some Food and a pocket Knife');
checkBaggage('Socks and camera');
checkBaggage('Got some snacks and a gun for protection');


///////////////////////////////////////
// Working With Strings - Part 3

// Split and join
console.log('a+very+nice+string'.split('+'));
console.log('Jonas Schmedtmann'.split(' '));

const [firstName, lastName] = 'Jonas Schmedtmann'.split(' ');

const newName = ['Mr.', firstName, lastName.toUpperCase()].join(' ');
console.log(newName);

const capitalizeName = function (name) {
  const namesArray = name.toLowerCase().split(' ');
  const namesCapitalized = [];

  for (const n of namesArray) {
    // namesUpper.push(n[0].toUpperCase() + n.slice(1));
    namesCapitalized.push(
        n.replace(
          n[0],
          n[0].toUpperCase()
        )
    );
  }
  console.log(namesCapitalized.join(' '));
};

capitalizeName('jessica ann smith davis');
capitalizeName('jonas schmedtmann');

// Padding
const message = 'Go to gate 23!';
console.log(message.padStart(20, '+').padEnd(30, '+'));
console.log('Jonas'.padStart(20, '+').padEnd(30, '+'));

const maskCreditCard = function (number) {
  const str = number + '';
  const last = str.slice(-4);
  return last.padStart(16, '*');
};

console.log(maskCreditCard(64637836));
console.log(maskCreditCard(43378463864647384));
console.log(maskCreditCard('334859493847755774747'));

// Repeat
const message2 = 'Bad weather... All Departures delayed... ';
console.log(message2.repeat(5));

const planesInLine = function (n) {
  console.log(`There are ${n} planes in line ${'🛩'.repeat(n)}`);
};
planesInLine(5);
planesInLine(3);
planesInLine(12);


///////////////////////////////////////
// String Methods Practice

const flights =
    '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// 🔴 Delayed Departure from FAO to TXL (11h25)
//              Arrival from BRU to FAO (11h45)
//   🔴 Delayed Arrival from HEL to FAO (12h05)
//            Departure from FAO to LIS (12h30)

const getCode = str => str.slice(0, 3).toUpperCase();

for (const flight of flights.split('+')) {
  const [type, from, to, time] = flight.split(';');
  const output = `
      ${type.startsWith('_Delayed') ? '🔴' : ''}
      ${type.replaceAll(
        '_',
        ' '
      )} 
      ${getCode(from)} 
      ${getCode(to)} 
      (${time.replace(':', 'h')})
    `.padStart(36);
  console.log(output);
}


console.log(`==================== Challenges =========================`)


const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

///////////////////////////////////////
// Coding Challenge #1

/* 
We're building a football betting app (soccer for my American friends 😅)!

Suppose we get data from a web service about a certain game (below). In this challenge we're gonna work with the data. So here are your tasks:

1. Create one player array for each team (variables 'players1' and 'players2')
2. The first player in any player array is the goalkeeper and the others are field players. For Bayern Munich (team 1) create one variable ('gk') with the goalkeeper's name, and one array ('fieldPlayers') with all the remaining 10 field players
3. Create an array 'allPlayers' containing all players of both teams (22 players)
4. During the game, Bayern Munich (team 1) used 3 substitute players. So create a new array ('players1Final') containing all the original team1 players plus 'Thiago', 'Coutinho' and 'Perisic'
5. Based on the game.odds object, create one variable for each odd (called 'team1', 'draw' and 'team2')
6. Write a function ('printGoals') that receives an arbitrary number of player names (NOT an array) and prints each of them to the console, along with the number of goals that were scored in total (number of player names passed in)
7. The team with the lower odd is more likely to win. Print to the console which team is more likely to win, WITHOUT using an if/else statement or the ternary operator.

TEST DATA FOR 6: Use players 'Davies', 'Muller', 'Lewandowski' and 'Kimmich'. Then, call the function again with players from game.scored


// 1.
const [players1, players2] = game.players;
console.log(players1, players2);

// 2.
const [gk, ...fieldPlayers] = players1;
console.log(gk, fieldPlayers);

// 3.
const allPlayers = [...players1, ...players2];
console.log(allPlayers);

// 4.
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Periscic'];

// 5.
const {
  odds: { team1, x: draw, team2 },
} = game;
console.log(team1, draw, team2);

// 6.
const printGoals = function (...players) {
  console.log(players);
  console.log(`${players.length} goals were scored`);
};

// printGoals('Davies', 'Muller', 'Lewandowski', 'Kimmich');
// printGoals('Davies', 'Muller');
printGoals(...game.scored);

// 7.
team1 < team2 && console.log('Team 1 is more likely to win');
team1 > team2 && console.log('Team 2 is more likely to win');


*/

///////////////////////////////////////
// Coding Challenge #2

/*
Let's continue with our football betting app!

1. Loop over the game.scored array and print each player name to the console, along with the goal number (Example: "Goal 1: Lewandowski")
2. Use a loop to calculate the average odd and log it to the console (We already studied how to calculate averages, you can go check if you don't remember)
3. Print the 3 odds to the console, but in a nice formatted way, exaclty like this:
      Odd of victory Bayern Munich: 1.33
      Odd of draw: 3.25
      Odd of victory Borrussia Dortmund: 6.5
Get the team names directly from the game object, don't hardcode them (except for "draw"). HINT: Note how the odds and the game objects have the same property names 😉

BONUS: Create an object called 'scorers' which contains the names of the players who scored as properties, and the number of goals as the value. In this game, it will look like this:
      {
        Gnarby: 1,
        Hummels: 1,
        Lewandowski: 2
      }


// 1.
for (const [i, player] of game.scored.entries())
  console.log(`Goal ${i + 1}: ${player}`);

// 2.
const odds = Object.values(game.odds);
let average = 0;
for (const odd of odds) average += odd;
average /= odds.length;
console.log(average);

// 3.
for (const [team, odd] of Object.entries(game.odds)) {
  const teamStr = team === 'x' ? 'draw' : `victory ${game[team]}`;
  console.log(`Odd of ${teamStr} ${odd}`);
}

// Odd of victory Bayern Munich: 1.33
// Odd of draw: 3.25
// Odd of victory Borrussia Dortmund: 6.5

// BONUS
// So the solution is to loop over the array, and add the array elements as object properties, and then increase the count as we encounter a new occurence of a certain element
const scorers = {};
for (const player of game.scored) {
  scorers[player] ? scorers[player]++ : (scorers[player] = 1);
}


*/


///////////////////////////////////////
// Coding Challenge #3

/* 
Let's continue with our football betting app! This time, we have a map with a log of the events that happened during the game. 
The values are the events themselves, and the keys are the minutes in which each event happened (a football game has 90 minutes plus some extra time).

1. Create an array 'events' of the different game events that happened (no duplicates)
2. After the game has finished, is was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.
3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
      [FIRST HALF] 17: ⚽️ GOAL


const gameEvents = new Map([
  [17, '⚽️ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽️ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽️ GOAL'],
  [80, '⚽️ GOAL'],
  [92, '🔶 Yellow card'],
]);


// 1.
const events = [...new Set(gameEvents.values())];
console.log(events);

// 2.
gameEvents.delete(64);

// 3.
console.log(
  `An event happened, on average, every ${90 / gameEvents.size} minutes`
);
const time = [...gameEvents.keys()].pop();
console.log(time);
console.log(
  `An event happened, on average, every ${time / gameEvents.size} minutes`
);

// 4.
for (const [min, event] of gameEvents) {
  const half = min <= 45 ? 'FIRST' : 'SECOND';
  console.log(`[${half} HALF] ${min}: ${event}`);
}


*/


///////////////////////////////////////
// Coding Challenge #4

/*
Write a program that receives a list of variable names written in underscore_case and convert them to camelCase.

The input will come from a textarea inserted into the DOM (see code below), and conversion will happen when the button is pressed.

THIS TEST DATA (pasted to textarea)
underscore_case
 first_name
Some_Variable 
  calculate_AGE
delayed_departure

SHOULD PRODUCE THIS OUTPUT (5 separate console.log outputs)
underscoreCase      ✅
firstName           ✅✅
someVariable        ✅✅✅
calculateAge        ✅✅✅✅
delayedDeparture    ✅✅✅✅✅

HINT 1: Remember which character defines a new line in the textarea 😉
HINT 2: The solution only needs to work for a variable made out of 2 words, like a_b
HINT 3: Start without worrying about the ✅. Tackle that only after you have the variable name conversion working 😉
HINT 4: This challenge is difficult on purpose, so start watching the solution in case you're stuck. Then pause and continue!

Afterwards, test with your own test data!



document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

document.querySelector('button').addEventListener('click', function () {
  const text = document.querySelector('textarea').value;
  const rows = text.split('\n');

  for (const [i, row] of rows.entries()) {
    const [first, second] = row.toLowerCase().trim().split('_');

    const output = `${first}${second.replace(
      second[0],
      second[0].toUpperCase()
    )}`;
    console.log(`${output.padEnd(20)}${'✅'.repeat(i + 1)}`);
  }
});

*/