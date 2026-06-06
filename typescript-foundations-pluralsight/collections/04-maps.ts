// EXAMPLE: declaring a map
let weatherData: Map<string, { temperature: number, condition: string }> = new Map();

// EXAMPLE: adding to a map
weatherData.set('Orlando', {"temperature": 85, "condition": "Cloudy"});
weatherData.set('New York', {"temperature": 75, "condition": "Sunny"});
weatherData.set('Draper', {"temperature": 70, "condition": "Rainy"});
weatherData.set(100, {"temperature": 100, "condition": "Sunny"}); // compiler catches type mismatch in key
weatherData.set('Los Angeles', {"temperature": "100", "condition": "Sunny"}); // compiler catches type mismatch in value

// EXAMPLE: getting a value from a key - get() return type is type | undefined
let city = weatherData.get('New York');
if(city == undefined) {
  console.log(`City not found`);
} else {
  console.log(city.condition, city.temperature);
}

// EXAMPLE: declaring a readonly map
let wd: ReadonlyMap<string, {temperature: number, condition: string}> = new Map([
  ["Orlando", { "temperature": 85, "condition": "Cloudy" }],
  ["New York", { "temperature": 75, "condition": "Sunny" }],
  ["Draper", { "temperature": 70, "condition": "Rainy" }]
]);
wd.set('Los Angeles', {}) // compiler catches trying to modify a readonly map