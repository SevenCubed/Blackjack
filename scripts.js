class Shape {
    constructor(color, name){
        this.color = color
        this.name = name
    }
    returnName() {
        return this.name;
    }
    returnColor() {
        return this.color;
    }
}

class Circle extends Shape {
    constructor(radius, color, name){
        super(color,name);
        this.radius = radius
    }
    returnRadius(){
        return this.radius;
    }
    calcArea() {
        return Math.PI * Math.pow(this.radius, 2);
    }
    
}

class Rectangle extends Shape {
    constructor(width, height, color, name){
        super(color,name);
        this.width = width;
        this.height = height;
    }
    calcArea(){
        return this.width*this.height;
    }
    returnWidth(){
        return this.width;
    }
    returnHeight(){
        return this.height;
    }

}

class Square extends Rectangle {
    constructor(size, color, name){
        super(color,name);
        this.size = size
        this.width = size
        this.height = size
    }
    //Area method is in Rectangle, color and name method is in Shape
    returnSize(){
        return this.size;
    }
}

//circles
console.log('Circles');
const smallCircle = new Circle(1.5, 'blue', 'small');
const medCircle = new Circle (10, 'red', 'medium');
const bigCircle = new Circle (20, 'yellow', 'big');
console.log(smallCircle.calcArea());
console.log(medCircle.calcArea());
console.log(bigCircle.calcArea());
//squares
console.log('Squares');
const smallSquare = new Square(2, 'black', 'small');
const medSquare = new Square(5, 'green', 'medium');
const bigSquare = new Square(100, 'orange', 'big');
console.log(smallSquare.calcArea());
console.log(medSquare.calcArea());
console.log(bigSquare.calcArea());
//rectangles
console.log('Rectangles');
const smallRectangle = new Rectangle(2, 5, 'black', 'small');
const medRectangle = new Rectangle(5, 10, 'green', 'medium'); 
const bigRectangle = new Rectangle(100, 100, 'orange', 'square in disguise');
console.log(smallRectangle.calcArea());
console.log(medRectangle.calcArea());
console.log(bigRectangle.calcArea());
//superclass tests
console.log(`The ${medCircle.returnName()} circle's area equals to ${Math.round(medCircle.calcArea())}.`)