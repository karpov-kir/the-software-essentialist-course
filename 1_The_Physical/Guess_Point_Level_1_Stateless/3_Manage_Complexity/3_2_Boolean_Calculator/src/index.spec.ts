import { BooleanCalculator } from './';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  it('tells that "TRUE" is truthy', () => {
    expect(booleanCalculator.isTruthy('TRUE')).toBeTruthy();
  });

  it('tells that "FALSE" is falsy', () => {
    expect(booleanCalculator.isTruthy('FALSE')).toBeFalsy();
  });
});
