/**
 * Discrete requirements:
 * - outputs numbers as a string
 * - for multiples of three it returns "Fizz"
 * - for multiples of five it returns "Buzz."
 * - for numbers that are multiples of both three and five, it returns "FizzBuzz."
 * - takes numbers from 1 to 100
 */
export const fizzbuzz = (value: number) => {
    if (value % 3 === 0) {
        return "Fizz"
    }

    return value.toString();
}