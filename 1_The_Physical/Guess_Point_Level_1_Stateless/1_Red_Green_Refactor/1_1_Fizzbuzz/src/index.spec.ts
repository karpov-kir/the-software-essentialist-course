import { fizzbuzz } from './fizzbuzz';

describe("fizzbuzz", () => {
    it('throws an error for numbers less than 1 such as 0', () => {
        expect(() => fizzbuzz(0)).toThrow()
    })

    it('throws an error for numbers greater than 100 such as 101', () => {
        expect(() => fizzbuzz(101)).toThrow()
    })

    it('returns a number such as 10 as a string', () => {
        expect(typeof fizzbuzz(10) === 'string').toBeTruthy()
    })

    it('returns "Fizz" for multiples of 3 such as 9', () => {
        expect(fizzbuzz(9)).toBe("Fizz")
    })

    it('returns "Buzz." for multiples of 5 such as 20', () => {
        expect(fizzbuzz(20)).toBe("Buzz.")
    })

    it('returns "FizzBuzz." for multiples of both 3 and 5 such as 15', () => {
        expect(fizzbuzz(15)).toBe("FizzBuzz.")
    })

    test.each([
        [3, 'Fizz'],
        [5, 'Buzz.',],
        [19, '19'],
        [30, 'FizzBuzz.'],
        [33, 'Fizz'],
        [43, '43'],
        [60, 'FizzBuzz.'],
        [100, 'Buzz.',],
      ])(`given %i returns "%s"`, (value, expected) => {
        expect(fizzbuzz(value)).toBe(expected);
      });
});