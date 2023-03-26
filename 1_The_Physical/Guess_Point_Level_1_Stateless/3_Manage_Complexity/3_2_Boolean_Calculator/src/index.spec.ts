import { BooleanCalculator } from './';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  describe('truthy', () => {
    it.each(['TRUE', 'TRUE AND TRUE', 'FALSE OR TRUE', 'NOT FALSE', 'TRUE AND NOT FALSE'])(
      'tells that "%s" is truthy',
      (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
      },
    );
  });

  describe('falsy', () => {
    it.each(['FALSE', 'TRUE AND FALSE', 'FALSE OR TRUE AND FALSE', 'NOT TRUE', 'TRUE AND NOT TRUE'])(
      'tells that "%s" is falsy',
      (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
      },
    );
  });

  describe('unexpected input error', () => {
    it('rejects "TRUE UNEXPECTED FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE UNEXPECTED FALSE')).toThrowError(
        'Expected a token of type "Logic" but got "UNEXPECTED"',
      );
    });

    it('rejects "FALSE OR AND FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR AND FALSE')).toThrowError(
        'Expected a token of type "Boolean" or "Not" but got "AND"',
      );
    });

    it('rejects "FALSE OR NOT NOT FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR NOT NOT FALSE')).toThrowError(
        'Expected a token of type "Boolean" but got "NOT"',
      );
    });

    it('rejects "NOT NOT" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('NOT NOT')).toThrowError(
        'Expected a token of type "Boolean" but got "NOT"',
      );
    });

    it('rejects "TRUE AND TRUE FALSE" rejects with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE AND TRUE FALSE')).toThrowError(
        'Expected a token of type "Logic" but got "FALSE"',
      );
    });
  });
});
