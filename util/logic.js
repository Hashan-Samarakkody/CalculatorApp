/*
    File Name: logic.js
    Author: S.D.S.H. Samarakkodi
    Student ID: IM/2021/007
    Description: This file contains the logic for the calculator app.
    Date Created: 2024-09-05
*/


// Import mathjs for evaluating expressions
import { evaluate } from 'mathjs';

// Check if value has operator
export const valueHasOp = (value) => {
    const operators = ['+', '-', '*', '/'];
    return operators.some(op => value.includes(op));
};

// Check if expression is valid
export const isValidExpression = (expression) => {
    // Handle cases like ".5" by adding "0" before the decimal if needed
    expression = expression.replace(/^(\.\d+)/, '0$1');
    const regex = /^[0-9+\-*/×÷(). ]+$/; // Allow only valid characters
    return regex.test(expression);
};

// Check for division by zero
const hasDivisionByZero = (expression) => {
    const regex = /\/\s*0/; // Regex to match any division by zero
    return regex.test(expression);
};

// Calculate result
export const calculateResult = (calValue) => {
    if (!isValidExpression(calValue)) {
        return ''; // Return empty string if invalid
    }

    if (hasDivisionByZero(calValue)) {
        return 'undefined'; // Return a message or value for division by zero
    }

    try {
        const sanitizedValue = calValue.replace(/×/g, '*').replace(/÷/g, '/');
        const result = evaluate(sanitizedValue); // Use mathjs to evaluate
        return result.toString();
    } catch (error) {
        return ''; // Return empty string if an error occurs
    }
};
