//function to add numbers
const add = (a, b) => {
    return a + b;
}
 

//function to subtract numbers
const subtract = (a, b) => {
    return a - b;
}

//function to multiply numbers
const multiply = (a, b) => {
    return a * b;
}

//function to divide numbers
const divide = (a, b) => {
    // if (b === 0) {
    //     throw new Error ("Division by zero not allowed");
    // }
    return a / b;
}

module.exports = {add, subtract, multiply, divide};