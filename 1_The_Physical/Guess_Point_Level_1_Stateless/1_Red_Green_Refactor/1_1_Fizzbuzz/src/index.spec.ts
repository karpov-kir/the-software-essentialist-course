import { fizzbuzz } from './fizzbuzz';

describe("fizzbuzz", () => {
    it('returns a number such as 10 as a string', () => {
        expect(typeof fizzbuzz(10) === 'string').toBeTruthy()
    })

    it('returns "Fizz" for multiples of 3 such as 9', () => {
        expect(fizzbuzz(9)).toBe("Fizz")
    })

    it('returns "Buzz." for multiples of 5 such as 20', () => {
        expect(fizzbuzz(20)).toBe("Buzz.")
    })
});