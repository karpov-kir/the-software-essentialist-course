import { BooleanCalculator } from './';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  it('tells that "TRUE" is truthy', () => {
    expect(booleanCalculator.isTruthy('TRUE')).toBeTruthy();
  });
});
