import { NonEmptySequence, StatsCalculator } from './';

const statsCalculator = new StatsCalculator();

type TestSample = Array<{
  values: NonEmptySequence;
  result: number;
}>;

describe(StatsCalculator, () => {
  describe('minimum value', () => {
    it.each([
      { values: [1, 2, 3], result: 1 },
      { values: [2, 4, 21, -8, 53, 40], result: -8 },
    ] as TestSample)(`knows that $result is the minimum value in $values`, ({ values, result }) => {
      const stats = statsCalculator.calculate(values);

      expect(stats).toEqual(expect.objectContaining({ min: result }));
    });
  });

  describe('maximum value', () => {
    it.each([
      { values: [1, 2, 3], result: 3 },
      { values: [2, 4, 21, -8, 53, 40], result: 53 },
    ] as TestSample)(`knows that $result is the maximum value in $values`, ({ values, result }) => {
      const stats = statsCalculator.calculate(values);

      expect(stats).toEqual(expect.objectContaining({ max: result }));
    });
  });

  describe('number of elements', () => {
    it.each([
      { values: [1, 2, 3], result: 3 },
      { values: [2, 4, 21, -8, 53, 40], result: 6 },
    ] as TestSample)(`knows that $result is the number of elements in $values`, ({ values, result }) => {
      const stats = statsCalculator.calculate(values);

      expect(stats).toEqual(expect.objectContaining({ numberOfElements: result }));
    });
  });

  describe('average value', () => {
    it.each([
      { values: [1, 2, 3], result: 2 },
      { values: [2, 4, 21, -8, 53, 40], result: 18.666666666666668 },
    ] as TestSample)(`knows that $result is the average value of $values`, ({ values, result }) => {
      const stats = statsCalculator.calculate(values);

      expect(stats).toEqual(expect.objectContaining({ average: result }));
    });
  });

  it('does not accept an empty sequence', () => {
    // @ts-expect-error cannot accept empty sequence
    statsCalculator.calculate([]);
  });
});
