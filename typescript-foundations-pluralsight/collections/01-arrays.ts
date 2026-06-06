// EXAMPLE: two ways to declare an array
// let cityNames: string[] = [];
let cityNames: Array<string> = []; // alternative way to declare an array

// EXAMPLE: adding to an array
cityNames.push("Los Angeles, CA");
cityNames.push(50); // compiler catches type mismatch

// EXAMPLE: removing from an array - pop() return type is type | undefined
let city = cityNames.pop()
if(city == undefined) {
  console.log(`city not available`);
} else {
  console.log(`City name: ${city}`);
}

// EXAMPLE: compiler infers literal union for find() return type
let orlando = cityNames.find((cityName) => cityName == "Orlando, FL");

// EXAMPLE: iteration with correctly inferred types of loop variable
cityNames.forEach(cityName => {
  console.log(cityName);
});

for(let cityName of cityNames) {
  console.log(cityName);
}

// EXAMPLE: map correctly inferring return type
let cities: Array<string> = ["orlando", "draper", "westlake"];
let uppercaseCities = cities.map((city) => {
  return city[0].toUpperCase() + city.slice(1);
});
console.log(uppercaseCities);

// EXAMPLE: filter correctly inferring return type
let temperatures: number[] = [88, 75, 95];
let lowerTemps = temperatures.filter((temperature: number) => temperature < 80);

// EXAMPLE: custom sort function with type annotations
let temps: number[] = [88, 75, 95, 100, 102, 101];
temps.toSorted()
temps.toSorted((a: number, b: number) => a - b);

// EXAMPLE: compiler catching an attempt to modify a readonly array
interface Config {
  option: string;
  val: string;
};

let options: Config[] = [{ option: "yes", val: "no" }, { option: "yes", val: "no" }];
function applyConfig(options: readonly Config[]) {
  options.pop();
}