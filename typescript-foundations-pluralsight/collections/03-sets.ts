// EXAMPLE: declaring a set
let conditions: Set<string> = new Set();

// EXAMPLE: adding to a set
conditions.add("Rainy");
conditions.add("Sunny");
conditions.add(3); // compiler catches type mismatch

// EXAMPLE: declaring a readonly set
let cond: ReadonlySet<string> = new Set(["Rainy", "Sunny"]);
cond.add("Cloudy"); // compiler catches trying to modify a readonly set

// EXAMPLE: iterating through set values and the loop variable type is correctly inferred
for(let c of conditions) {
  console.log(c);
}