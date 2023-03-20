/**
 * Discrete requirements:
 * - outputs numbers as a string
 * - for multiples of three it returns "Fizz"
 * - for multiples of five it returns "Buzz."
 * - for numbers that are multiples of both three and five, it returns "FizzBuzz."
 * - takes numbers from 1 to 100
 */
export const fizzbuzz = (value: number) => {
    if (isMultiplierOf(3, value) && isMultiplierOf(5, value)) {
        return "FizzBuzz."
    }

    if (isMultiplierOf(3, value)) {
        return "Fizz"
    }

    if (isMultiplierOf(5, value)) {
        return "Buzz."
    }

    return value.toString();
}

export const isMultiplierOf = (multiplier: number, value: number) => {
    return value % multiplier === 0
}