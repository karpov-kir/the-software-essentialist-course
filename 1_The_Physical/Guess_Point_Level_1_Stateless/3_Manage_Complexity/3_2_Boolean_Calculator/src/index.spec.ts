import { BooleanCalculator } from './';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  describe('truthy', () => {
    it.each(['TRUE', 'TRUE AND TRUE', 'FALSE OR TRUE'])('tells that "%s" is truthy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
    });
  });

  describe('falsy', () => {
    it.each(['FALSE', 'TRUE AND FALSE', 'FALSE OR TRUE AND FALSE'])('tells that "%s" is falsy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
    });
  });

  describe('unexpected input error', () => {
    it('rejects "TRUE UNEXPECTED FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE UNEXPECTED FALSE')).toThrowError('Unexpected token "UNEXPECTED"');
    });

    it('rejects "FALSE OR AND FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR AND FALSE')).toThrowError(
        'Expect a boolean token but go "AND"',
      );
    });

    it('rejects "TRUE AND TRUE FALSE" rejects with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE AND TRUE FALSE')).toThrowError(
        'Expect a logic token but go "FALSE"',
      );
    });
  });
});
