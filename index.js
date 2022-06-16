
// object literal
const literalCircle = {
    radius: 1, // member -> property
    draw: function(){ // member -> method
        console.log('object literal circle'); 
    }
};

literalCircle.draw();

// factory
function circleFactory(radius){
    return {
        radius, // same as radius:radius
        draw: function(){ 
            console.log('factory circle'); 
        }
    };
}

const factoryCircle = circleFactory(1);
factoryCircle.draw();

// constructor
function ConstructorCircle(radius){
    this.radius = radius; // "this" references the empty object {} created by new
    this.draw = function(){
        console.log('constructor circle')
    }
}

const constructorCircle = new ConstructorCircle(1) // creates an empty object {} then points "this" to it
constructorCircle.draw();

// what a constructor looks like behind the scenes
const ConstructorCircleInternal = new Function('radius',` 
    this.radius = radius;
    this.draw = function(){
        console.log('constructor circle internal representation')
    }
`); // internally this is what JS is doing when you use constructor

const internalCircle = new ConstructorCircleInternal(1);
// new operator internally does this:
ConstructorCircle.call({},1,2,3)  // and points "this" to the first argument
ConstructorCircle.apply({},[1,2,3]) // same ass call but rest of arguments are in array
internalCircle.draw();

let x = {}; // js interprets this as "let x = new Object();"

new String(); // '',"",'' // string literals // creates new wrapper object around primitive
new Boolean(); // true, false // boolean literals // creates new wrapper object around primitive
new Number(); // 1,2,3 // integer literals // creates new wrapper object around primitive

const circle = new ConstructorCircle(1)

for (let key in circle) { // loop through all members and get key
    if (typeof circle[key] != 'function'){ // if member is not a function
        console.log(circle[key]);
    }
}

const keys = Object.keys(circle); // all keys in circle

if ('radius' in circle) { // key "radius" exists within circle object
    console.log("circle has radius");
}

function ScopeCircle(radius) {
    this.visible = false; // public variable
    let _radius = radius; // private variable 
    let radiusValid = (radius) => radius > 0; // private function
    this.setRadius = function(radius){  // public function
        if(radiusValid) { // private member not called with "this"
            _radius = radius;  // private member not called with "this"
            this.visible = true; // public member called with "this"
        }
    }

    // getters and setters - not visible in autocomplete
    Object.defineProperty(this,'_radius',{ 
        get: function(){ // readonly getter // scopeCircle.radius
            return _radius;
        },
        set: function(value){ // setter // scopeCircle.radius = x;
            if (value > 0) _radius = value; // can perform validation
        },
        writeable: false, // sets object to read only
        enumerable: false, // object will not show up when something containing it is iterated through
        configurable: false // object cannot be deleted
    })
}

function Square(){
    this.move = function(){
        this.log("off we go"); // call method on prototype (parent) from instance (child)
    }
};
const square = new Square();

Object.getPrototypeOf(square); // square's prototype: "Square" // same as:
Square.prototype; // The "Square" prototype

Square.prototype.draw = function(){ // moving methods to prototype
    console.log("|__|");
    this.move(); // call method on instance (child) from prototype (parent)
}

Square.prototype.log = function(text){ 
    console.log(text);
}

// prototype functions added after object instanced are also available to instance
square.log('this method was defined after "square" was created');

square.draw(); // js tries to find method on object -> prototype -> parent etc 

Square.prototype.toString = function(){ // override parent method 
    return 'square override';
}

console.log(square.toString());

Object.keys(square); // only lists "move" as Object.keys only returns instance members

for (let key in square); // lists instance + prototype members

square.hasOwnProperty('move') // true // own === instance
square.hasOwnProperty('draw') // false // draw is prototype member

// PROTOTYPE INHERITANCE
function Shape (){} // parent object
function Triangle (){} // child object
Shape.prototype.log = () => console.log('im a shape!');

// currently Circle's prototype inherits Object prototype
Triangle.prototype == Object.create(Object.prototype);
// and constructor on prototype == triangle
console.log(Triangle.prototype.constructor); // Triangle

// change Circle prototype to inherit from Shape prototype
Triangle.prototype = Object.create(Shape.prototype); 

// now triangle inherits from shape
const triangle = new Triangle();
triangle.log();

// but now triangle's constructor is also set to shape
console.log(Triangle.prototype.constructor); // Shape
// change this back to Triangle constructor
Triangle.prototype.constructor = Triangle; // always do this after changing prototype inheritance

// now Triangle is prototype of Shape but uses Triangle constructor
console.log(Triangle.prototype); // Shape
console.log(Triangle.prototype.constructor); // Triangle

function extend (child, parent){
    child.prototype = Object.create(parent.prototype); 
    child.prototype.constructor = child;
}

// Calling super constructor
function Car (color){
    this.color = color;
}

function Mazda (speed, color){
    Car.call(this,color); // calling super constructor
    this.speed = speed;
}

function Bmw (seats){
    this.seats = seats; 
    // color not initialized so instances wont have this property
}

extend(Mazda,Car);
extend(Bmw,Car);

const mazda = new Mazda(100,'blue');
const bmw = new Bmw(5);

Car.prototype.drive = () => console.log('zoom zoom zoom');

mazda.drive(); // both now have access to drive
bmw.drive();

console.log(mazda.color); // mazda calls super constructor so color is initialized
console.log(bmw.color); // undefined as color is not initialized

// OVERRIDE
Bmw.prototype.explode = function () {
    Car.prototype.explode.call(this); // optional - call parent explode then do:
    console.log('Crash Bang Boom'); 
}
// bmw prototype takes precedence as js walks up the inheritance chain
Car.prototype.explode = () => console.log('kaboom');

mazda.explode(); // Mazda follows Car implementation
bmw.explode(); // Bmw follows overridden definition

const cars = [mazda,bmw];
for (let car of cars){
    car.explode(); // polymorphism
}

// MIXINS 
const canEat = {
    eat: function() {
        this.hunger--;
        console.log('eating');
    }
}

const canWalk = {
    walk: function (){
        console.log('walking');
    }
}

const canSwim = {
    swim: function(){
        console.log('swimming');
    }
}

const human = Object.assign({},canEat,canWalk);
human.eat();
human.walk();

function Fish () {}
Object.assign(Fish.prototype,canEat,canSwim);

const goldFish = new Fish();
goldFish.eat();
goldFish.swim();

function mixin(target,...sources){ // rest operator turns rest of arguments into array
    Object.assign(target,...sources) // spread operator spreads array into arguments
}


// CLASSES - not real classes -> syntactic sugar over inheritance 
// essentially cleaner syntax for prototypical inheritance 
class Bean { // is actually a function
    constructor(size){
        this.size = size;
        this.flower = () => console.log('flowering'); // sets function on instance
    }
    grow(){ // sets function on prototype // still instance method
        console.log('growing');
    }
    static package (...beans){
        return {...beans};
    }
}

const bean = new Bean(1);
bean.flower();
bean.grow();
const package = Bean.package('bean 1','bean 2', 'bean 3');
console.log(package);

// HOISTING - functions are processed first by compiler
sayHello(); // will run fine as sayHello is hoisted
function sayHello() {} // declarations ARE hoisted

const sayGoodbye = function(){}; // expressions are NOT hoisted
sayGoodbye(); // meaning it can only be called after declaration

class Dinosaur {} // declaration not hoisted
const Bird = class {} // expression not hoisted

// THIS keyword

const Bottle = function() {
    this.fill = function () {console.log(this);}
}

const bottle = new Bottle(); 


// Method call - calling a method on (or from) an object
bottle.fill() // "this" points to bottle object

// function call - calling standalone function
const fill = bottle.fill;
fill(); // "this" points to window (or global in node) object

// strict mode changes behavior of "this"
"use strict"; // i think this isn't working?
fill(); // should return undefined (except it still returns window?)

class Cup { // class bodies are executed in strict mode
    empty(){
        console.log(this);
    }
}

const cup = new Cup();
cup.empty();// "this" returns cup instance // method call
const empty = cup.empty;
empty(); // "this" returns undefined // function call in strict mode
