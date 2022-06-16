const _id = new WeakMap(); // can hide this in module 

export class Shower { // export makes public, everything else private
    constructor(id){
        _id.set(this, id);
    }
    printId(){
        console.log(_id.get(this));
    }
}
