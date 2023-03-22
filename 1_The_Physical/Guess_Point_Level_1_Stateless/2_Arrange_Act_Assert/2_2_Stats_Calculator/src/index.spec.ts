import { StatsCalculator } from './';

const statsCalculator = new StatsCalculator();

describe(StatsCalculator, () => {
  it('finds a minimum value', () => {
    const stats = statsCalculator.calculate([1, 2, 3]);

    expect(stats).toEqual(expect.objectContaining({ min: 1 }));
  });

  it('finds a maximum value', () => {
    const stats = statsCalculator.calculate([1, 2, 3]);

    expect(stats).toEqual(expect.objectContaining({ max: 3 }));
  });
});
