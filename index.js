
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
        enumarable: false, // object will not show up when something containing it is iterated through
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
Triangle.prototype.constructor = Triangle;

// now Triangle is prototype of Shape but uses Triangle constructor
console.log(Triangle.prototype); // Shape
console.log(Triangle.prototype.constructor); // Triangle
