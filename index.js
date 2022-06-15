
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

function LeakyCircle(radius) {
    this.radius = radius; // circle.radius = 5; // can bypass setRadius
    this.setRadius = function(radius){
        if (radius > 0) this.radius = radius;
    }
    this.internalFunction = function () {} // can a
    this.externalFunction = function(){
        this.internalFunction();
    }
}

function PatchedCircle(radius) {
    let radius = radius; // let or const = private variable
    this.setRadius = function(radius){ // externally have to call setRadius
        if (radius > 0) this.radius = radius;
    }
    let internalFunction = function () {} // internalFunction now only accessible internally
    this.externalFunction = function(){  // externally need to call externalFunction
        internalFunction(); // private not called with "this"
    } 
}