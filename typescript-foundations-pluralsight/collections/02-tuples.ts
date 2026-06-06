// EXAMPLE: declaring a tuple with named parameters and optional parameter
let cityData: [city: string, temperature: number, condition: string, string?];

// EXAMPLE: assigning data to a tuple
cityData = ["Orlando, FL", 85, "Cloudy"];
cityData = ["Orlando, FL", 85, "Cloudy", "182 years old this year"];

// EXAMPLE: reading from a tuple by positional index (ONLY)
let temp = cityData[1];

// EXAMPLE: returning from a function as a tuple, and destructing that into individual values
function gatherData(): [string, number, string] {
  let city = "Orlando, FL";
  let temperature = 85;
  let condition = "Cloudy"
  return [city, temperature, condition];
}

let [city, temperature, condition] = gatherData();

// EXAMPLE: compiler catching attempt at modifying a readonly tuple
let rTuple: readonly [string, number, string] = ["Atlanta, GA", 75, "Rainy"];
rTuple[1] = 80;

// EXAMPLE: narrowing a tuple whose values are all strings into a readonly tuple with literal values
let singleTypeTuple = ["Orlando, FL", "85 degrees", "Cloudy"] as const;

// EXAMPLE: can't iterate tuples with for...of because of ambiguous typing, use destructuring instead 
let t2: [string, number, string] = ["Orlando, FL", 85, "Cloudy"];
for(let t of t2) {
  console.log(t);
}
let [n, t, c] = t2;