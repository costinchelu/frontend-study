'use strict';

///////////////////////////////////////
// Constructor Functions and the new Operator

const Person = function (firstName, birthYear) {
  // Instance properties
  this.firstName = firstName;
  this.birthYear = birthYear;

  // Bad practice! (we will copy the same function to as many objects as we create. We better use prototypes)
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // };
};

const jonas = new Person('Jonas', 1991);
console.log(jonas);
console.log(jonas instanceof Person);

// 1. New {} is created
// 2. the function is called, this = {} (this will point to the new object)
// 3. {} linked to prototype
// 4. function automatically returns {}

// we can create as many objects as we want from the same constructor function
const matilda = new Person('Matilda', 2017);

// Person.hey = function () {
//   console.log('Hey there 👋');
//   console.log(this);
// };
// Person.hey();


///////////////////////////////////////
// Prototypes

// each function in JS has a prototype property

console.log(Person.prototype);

// this is better than using the constructor function
// each object will have a reference to the prototype
Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

jonas.calcAge();
matilda.calcAge();

// jonas's prototype is the actual Person.prototype
console.log(jonas.__proto__ === Person.prototype);

console.log(Person.prototype.isPrototypeOf(jonas));   // true
console.log(Person.prototype.isPrototypeOf(matilda)); // true
console.log(Person.prototype.isPrototypeOf(Person));  // false

// we can also add properties to the prototype
Person.prototype.species = 'Homo Sapiens';
console.log(jonas.species, matilda.species);

// hasOwnProperty is a method inherited from Object.prototype
// jonas can use it because it is inherited through the prototype chain (jonas -> Person.prototype -> Object.prototype)
console.log(jonas.hasOwnProperty('firstName')); // true
console.log(jonas.hasOwnProperty('species'));   // false (accessible through the prototype)


///////////////////////////////////////
// Prototypal Inheritance on Built-In Objects

console.log(jonas.__proto__);
// Object.prototype (top of prototype chain)
console.log(jonas.__proto__.__proto__);
console.log(jonas.__proto__.__proto__.__proto__); // null, as Object.prototype has no prototype

// will point out to the constructor function for Person:
console.dir(Person.prototype.constructor);

const arr = [3, 6, 6, 5, 6, 9, 9]; // new Array === []

// we can get all methods for arrays, as we access Array.prototype (Array is the constructor function):
console.log(arr.__proto__);
console.log(arr.__proto__ === Array.prototype);

console.log(arr.__proto__.__proto__); // We will get Object.prototype

// so prototypal inheritance is a mechanism for reusing code

// we can even extend Array.prototype:
Array.prototype.unique = function () {
  return [...new Set(this)];
};
console.log(arr.unique());

const h1 = document.querySelector('h1');
console.dir(x => x + 1);


///////////////////////////////////////
// ES6 Classes

// are a syntactic sugar for constructor functions and prototypes
// (it looks more like how classes are defined in standard OOP languages)

// we can have a class expression
// const PersonCl = class {}

// but usually class declaration is seldom used:
class PersonCl {

    // the constructor is a class function and must be called constructor.
    // It will be called automatically when we create a new instance of the class.
    constructor(fullName, birthYear) {
        this.fullName = fullName;
        this.birthYear = birthYear;
    }

    // Instance methods - will be added to .prototype property
    calcAge() {
        console.log(2037 - this.birthYear);
    }

    greet() {
        console.log(`Hey ${this.fullName}`);
    }

    // getter
    get age() {
        return 2037 - this.birthYear;
    }

    // setter
    // both the setter and the constructor are trying to set the same property (fullname)
    // this will cause an infinite loop, as the setter will call itself again and again.
    // as a convention when we need to use the same name for the property, we use an underscore before the name of the property that we want to set in the setter.
    set fullName(name) {
        if (name.includes(' ')) this._fullName = name;
        else alert(`${name} is not a full name!`);
    }

    // but because _fullName is a different property than fullname, we will need to create a getter for _fullName
    get fullName() {
        return this._fullName;
    }
    // we are getting a new property though. However, it is a property that includes the logic in the setter so if we create a person
    // with two names separated by a space, then the setter will set the new _fullName property, but also the fullName property will be set to the same value,
    // so we can use the fullName property to get the name of the person.

    // we can have static methods (using the static keyword).
    // They will not be available in instances but only in the class itself.
    static hey() {
        console.log('Hey there 👋');
        console.log(this);
    }
}

const jessica = new PersonCl('Jessica Davis', 1996);
console.log(jessica);
jessica.calcAge();
console.log(jessica.age);

console.log(jessica.__proto__ === PersonCl.prototype);
jessica.greet();

PersonCl.hey();

// 1. Classes are NOT hoisted (use them after declaration)
// 2. Classes are first-class citizens
// 3. Classes are executed in strict mode


// we can set accessors for an object
const account = {
    owner: 'Jonas',
    movements: [200, 530, 120, 300],

    get latest() {
        return this.movements.slice(-1).pop();
    },

    // setter will have an argument, which will be the value that we set
    set latest(mov) {
        this.movements.push(mov);
    },
};

// calling the getter as a property, not as a method
console.log(account.latest);

// calling the setter as a property, not as a method
account.latest = 50;
console.log(account.movements);


///////////////////////////////////////
// Object.create

// create a prototype
const PersonProto = {
    calcAge() {
        console.log(2037 - this.birthYear);
    },

    init(firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    },
};

// now with Object.create we will link an object to a prototype:
const steven = Object.create(PersonProto);
console.log(steven); // steven is an empty object link to PersonProto
steven.name = 'Steven';
steven.birthYear = 2002;
steven.calcAge();

console.log(steven.__proto__ === PersonProto);  // true

const sarah = Object.create(PersonProto);
sarah.init('Sarah', 1979);
sarah.calcAge();


///////////////////////////////////////
// Inheritance Between "Classes": Constructor Functions

/*
Person is the parent class for Student:

    const Person = function (firstName, birthYear) {
        this.firstName = firstName;
        this.birthYear = birthYear;
    };
*/

// to not duplicate firstName and birthYear, we can use the prototype pattern:
const Student = function (firstName, birthYear, course) {
    Person.call(this, firstName, birthYear);
    this.course = course;
};

// Linking prototypes (we need to set the constructor property manually)
// and then we can add methods to the student's prototype
Student.prototype = Object.create(Person.prototype);

Student.prototype.introduce = function () {
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

// and now mike can use person's methods and its own methods
const mike = new Student('Mike', 2020, 'Computer Science');
mike.introduce();
mike.calcAge();

console.log(mike.__proto__);
console.log(mike.__proto__.__proto__);

console.log(mike instanceof Student);
console.log(mike instanceof Person);
console.log(mike instanceof Object);

Student.prototype.constructor = Student;
console.dir(Student.prototype.constructor);


///////////////////////////////////////
// Inheritance Between "Classes": ES6 Classes

class StudentCl extends PersonCl {

    // constructor is only needed when we introduce new properties to the child element
    constructor(fullName, birthYear, course) {
        // super should be called first (same arguments as the parent class constructor)
        super(fullName, birthYear);
        // new property for StudentCl class
        this.course = course;
    }

    // new method for StudentCl class
    introduce() {
        console.log(`My name is ${this.fullName} and I study ${this.course}`);
    }

    // we can even override parent class methods
    calcAge() {
        console.log(
            `I'm ${
                2037 - this.birthYear
            } years old, but as a student I feel more like ${
                2037 - this.birthYear + 10
            }`
        );
    }
}

const martha = new StudentCl('Martha Jones', 2012, 'Computer Science');
martha.introduce();
martha.calcAge();


///////////////////////////////////////
// Inheritance Between "Classes": Object.create

const StudentProto = Object.create(PersonProto);

StudentProto.init = function (firstName, birthYear, course) {
    PersonProto.init.call(this, firstName, birthYear);
    this.course = course;
};

StudentProto.introduce = function () {
    console.log(`My name is ${this.firstName} and I study ${this.course}`);
};

const jay = Object.create(StudentProto);
jay.init('Jay', 2010, 'Computer Science');
jay.introduce();
jay.calcAge();


///////////////////////////////////////
// Another Class Example

class Account2 {
    constructor(owner, currency, pin) {
        this.owner = owner;
        this.currency = currency;
        this.pin = pin;

        this.movements = [];
        this.locale = navigator.language;

        console.log(`Thanks for opening an account, ${owner}`);
    }

    // Public interface
    deposit(val) {
        this.movements.push(val);
    }

    withdraw(val) {
        this.deposit(-val);
    }

    approveLoan(val) {
        return true;
    }

    requestLoan(val) {
        if (this.approveLoan(val)) {
            this.deposit(val);
            console.log(`Loan approved`);
        }
    }
}

const acc1 = new Account2('Jonas', 'EUR', 1111);

// acc1.movements.push(250);
// acc1.movements.push(-140);
acc1.deposit(250);
acc1.withdraw(140);
acc1.approveLoan(1000);
acc1.requestLoan(1000);

console.log(acc1);
console.log(acc1.pin);


///////////////////////////////////////
// Encapsulation: Private Class Fields and Methods

// Public/Private fields/methods
// Static version of these 4

class Account {
    // these fields (not in the constructor) will be added to all instances of the class
    // they are public instance fields and they behave similarly to assigning them in the constructor
    locale = navigator.language;
    bank = 'Bankist';

    // movements and pin (marked with #) are private
    #movements = [];
    // pin can be assigned in the constructor, but it will not be accessible outside the class, as it is a private field
    #pin;

    // static field
    static site = 'www.bankist.com';

    constructor(owner, currency, pin) {
        this.owner = owner;
        this.currency = currency;
        this.#pin = pin;

        // this.movements = [];
        // this.locale = navigator.language;

        console.log(`Thanks for opening an account, ${owner}. ${this.bank}`);
    }

    // public methods (API)
    getMovements() {
        return this.#movements;
        // Not chainable
    }

    deposit(val) {
        this.#movements.push(val);
        return this;
    }

    withdraw(val) {
        this.deposit(-val);
        return this;
    }

    // private method
    #approveLoan(val) {
        // Fake method
        return true;
    }

    requestLoan(val) {
        if (this.#approveLoan(val)) {
            this.deposit(val);
            console.log(`Loan approved`);
        }
        return this;
    }

    // static method
    static test() {
        console.log('This is a static method');
    }
}

const acc2 = new Account('Jonas', 'EUR', 1111);

// we can chain methods that return the object itself (this)
// get movements will not be chainable, as it returns the movements, not the object itself,
// but it can be used to log the movements after chaining the other methods
const movements = acc2
    .deposit(300)
    .withdraw(100)
    .withdraw(50)
    .requestLoan(25000)
    .withdraw(4000)
    .getMovements();

console.log(acc2);
// console.log(acc2.#movements);
Account.test();
console.log(movements);


/*
///////////////////////////////////////
// Coding Challenge #1

/* 
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h
*/

/*
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is going at ${this.speed} km/h`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is going at ${this.speed} km/h`);
};

const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);

bmw.accelerate();
bmw.accelerate();
bmw.brake();
bmw.accelerate();
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h
*/

/*
class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed} km/h`);
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

const ford = new CarCl('Ford', 120);
console.log(ford.speedUS);
ford.accelerate();
ford.accelerate();
ford.brake();
ford.speedUS = 50;
console.log(ford);
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
2. Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo';
3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%
*/

/*
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(`${this.make} is going at ${this.speed} km/h`);
};

Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(`${this.make} is going at ${this.speed} km/h`);
};

const EV = function (make, speed, charge) {
  Car.call(this, make, speed);
  this.charge = charge;
};

// Link the prototypes
EV.prototype = Object.create(Car.prototype);

EV.prototype.chargeBattery = function (chargeTo) {
  this.charge = chargeTo;
};

EV.prototype.accelerate = function () {
  this.speed += 20;
  this.charge--;
  console.log(
    `${this.make} is going at ${this.speed} km/h, with a charge of ${this.charge}`
  );
};

const tesla = new EV('Tesla', 120, 23);
tesla.chargeBattery(90);
console.log(tesla);
tesla.brake();
tesla.accelerate();





///////////////////////////////////////
// Coding Challenge #4

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. They experiment with chining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%
*/

/*
class CarCl {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed} km/h`);
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed} km/h`);
    return this;
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

class EVCl extends CarCl {
  #charge;

  constructor(make, speed, charge) {
    super(make, speed);
    this.#charge = charge;
  }

  chargeBattery(chargeTo) {
    this.#charge = chargeTo;
    return this;
  }

  accelerate() {
    this.speed += 20;
    this.#charge--;
    console.log(
      `${this.make} is going at ${this.speed} km/h, with a charge of ${
        this.#charge
      }`
    );
    return this;
  }
}

const rivian = new EVCl('Rivian', 120, 23);
console.log(rivian);
// console.log(rivian.#charge);
rivian
  .accelerate()
  .accelerate()
  .accelerate()
  .brake()
  .chargeBattery(50)
  .accelerate();

console.log(rivian.speedUS);
*/
