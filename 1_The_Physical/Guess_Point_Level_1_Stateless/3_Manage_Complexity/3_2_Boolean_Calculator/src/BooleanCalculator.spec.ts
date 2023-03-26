import { BooleanCalculator } from './BooleanCalculator';

const booleanCalculator = new BooleanCalculator();

describe(BooleanCalculator, () => {
  describe('truthy', () => {
    it.each([
      'TRUE',
      'TRUE AND TRUE',
      'FALSE OR TRUE',
      'NOT FALSE',
      'TRUE AND NOT FALSE',
      '(FALSE OR TRUE) AND TRUE',
      '(FALSE OR TRUE) AND (FALSE OR TRUE)',
      '((FALSE OR TRUE) AND (FALSE OR TRUE))',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR TRUE))',
      '(TRUE)',
      '(NOT FALSE)',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR NOT FALSE))',
    ])('tells that "%s" is truthy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
    });

    describe('space insensitive', () => {
      it.each([
        ' TRUE  ',
        'TRUE    AND   TRUE',
        '(  (FALSE OR TRUE   ) AND   (FALSE OR TRUE))   ',
        '   ((  FALSE OR (  FALSE OR TRUE)   ) AND (FALSE OR TRUE))',
        '(  TRUE  )',
        '  (NOT FALSE)  ',
      ])('tells that "%s" is truthy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeTruthy();
      });
    });
  });

  describe('falsy', () => {
    it.each([
      'FALSE',
      'TRUE AND FALSE',
      'FALSE OR TRUE AND FALSE',
      'NOT TRUE',
      'TRUE AND NOT TRUE',
      '(FALSE OR TRUE) AND FALSE',
      '((FALSE OR TRUE) AND FALSE',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR (TRUE AND FALSE)))',
      '(FALSE)',
      '(NOT TRUE)',
      '((FALSE OR (FALSE OR TRUE)) AND (FALSE OR (FALSE AND NOT TRUE)))',
    ])('tells that "%s" is falsy', (booleanExpression) => {
      expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
    });

    describe('space insensitive', () => {
      it.each([
        ' FALSE  ',
        'TRUE    AND   FALSE',
        '(  (FALSE OR TRUE   ) AND   FALSE  )   ',
        '   ((  FALSE OR (  FALSE OR TRUE)   ) AND (FALSE OR (FALSE))',
        '(  FALSE  )',
        '  (NOT TRUE)  ',
      ])('tells that "%s" is truthy', (booleanExpression) => {
        expect(booleanCalculator.isTruthy(booleanExpression)).toBeFalsy();
      });
    });
  });

  describe('unexpected input error', () => {
    it('rejects "TRUE UNEXPECTED FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE UNEXPECTED FALSE')).toThrowError(
        'Expected a token of type "Logic" or "CloseGroup" but got "UNEXPECTED"',
      );
    });

    it('rejects "FALSE OR AND FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR AND FALSE')).toThrowError(
        'Expected a token of type "Boolean" or "Not" or "OpenGroup" but got "AND"',
      );
    });

    it('rejects "FALSE OR NOT NOT FALSE" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('FALSE OR NOT NOT FALSE')).toThrowError(
        'Expected a token of type "Boolean" or "OpenGroup" but got "NOT"',
      );
    });

    it('rejects "NOT NOT" with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('NOT NOT')).toThrowError(
        'Expected a token of type "Boolean" or "OpenGroup" but got "NOT"',
      );
    });

    it('rejects "TRUE AND TRUE FALSE" rejects with an unexpected token error', () => {
      expect(() => booleanCalculator.isTruthy('TRUE AND TRUE FALSE')).toThrowError(
        'Expected a token of type "Logic" or "CloseGroup" but got "FALSE"',
      );
    });
  });
});
