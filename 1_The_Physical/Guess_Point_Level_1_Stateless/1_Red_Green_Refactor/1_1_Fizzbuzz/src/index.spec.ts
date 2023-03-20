import { fizzbuzz } from './fizzbuzz';

describe("fizzbuzz", () => {
    it('returns a number such as 10 as a string', () => {
        expect(typeof fizzbuzz(10) === 'string').toBeTruthy()
    })
});