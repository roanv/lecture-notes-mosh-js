
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

let x = {}; // js interprets this as "let x = new Object();"

new String(); // '',"",'' // string literals // creates new wrapper object around primitive
new Boolean(); // true, false // boolean literals // creates new wrapper object around primitive
new Number(); // 1,2,3 // integer literals // creates new wrapper object around primitive