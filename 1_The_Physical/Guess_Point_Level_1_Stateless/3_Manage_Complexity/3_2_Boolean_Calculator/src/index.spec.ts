import { BooleanCalculator } from './';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  it('tells that "TRUE" is truthy', () => {
    expect(booleanCalculator.isTruthy('TRUE')).toBeTruthy();
  });

  it('tells that "FALSE" is falsy', () => {
    expect(booleanCalculator.isTruthy('FALSE')).toBeFalsy();
  });

  it('rejects "TRUE UNEXPECTED FALSE" with an unexpected token error', () => {
    expect(() => booleanCalculator.isTruthy('TRUE UNEXPECTED FALSE')).toThrowError('Unexpected token "UNEXPECTED"');
  });

  it('tells that "TRUE AND FALSE" is falsy', () => {
    expect(booleanCalculator.isTruthy('TRUE AND FALSE')).toBeFalsy();
  });

  it('tells that "TRUE AND TRUE" is truthy', () => {
    expect(booleanCalculator.isTruthy('TRUE AND TRUE')).toBeTruthy();
  });

  it('tells that "FALSE OR TRUE" is truthy', () => {
    expect(booleanCalculator.isTruthy('FALSE OR TRUE')).toBeTruthy();
  });

  it('tells that "FALSE OR TRUE AND FALSE" is falsy', () => {
    expect(booleanCalculator.isTruthy('FALSE OR TRUE AND FALSE')).toBeFalsy();
  });

  it('rejects "FALSE OR AND FALSE" with an unexpected token error', () => {
    expect(() => booleanCalculator.isTruthy('FALSE OR AND FALSE')).toThrowError('Expect a boolean token but go "AND"');
  });

  it('rejects "TRUE AND TRUE FALSE" rejects with an unexpected token error', () => {
    expect(() => booleanCalculator.isTruthy('TRUE AND TRUE FALSE')).toThrowError('Expect a logic token but go "FALSE"');
  });
});
