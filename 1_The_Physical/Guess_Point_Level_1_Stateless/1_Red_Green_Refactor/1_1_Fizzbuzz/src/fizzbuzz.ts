/**
 * Discrete requirements:
 * - outputs numbers as a string
 * - for multiples of three it returns "Fizz"
 * - for multiples of five it returns "Buzz."
 * - for numbers that are multiples of both three and five, it returns "FizzBuzz."
 * - takes numbers from 1 to 100
 */
export const fizzbuzz = (value: number) => {
    if (value < 1) {
        throw new Error('Value is too small')
    }

    if (value > 100) {
        throw new Error('Value is too big')
    }

    if (isMultipleOf(value, 3) && isMultipleOf(value, 5)) {
        return "FizzBuzz."
    }

    if (isMultipleOf(value, 3)) {
        return "Fizz"
    }

    if (isMultipleOf(value, 5)) {
        return "Buzz."
    }

    return value.toString();
}

export const isMultipleOf = (value: number, devisor: number) => {
    return value % devisor === 0
}