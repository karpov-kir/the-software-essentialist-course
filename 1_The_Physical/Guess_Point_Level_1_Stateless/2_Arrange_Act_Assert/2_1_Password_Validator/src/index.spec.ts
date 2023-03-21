import { PasswordValidator, ValidationResult } from './';

const passwordValidator = new PasswordValidator();

describe('password validator', () => {
  it('rejects a too short password', () => {
    const result = passwordValidator.validate('1');

    assertValidationResultError(result, 'Password is too short');
  });

  it('rejects a too long password', () => {
    const result = passwordValidator.validate('1'.repeat(16));

    assertValidationResultError(result, 'Password is too long');
  });

  it('rejects a password that does not contain at least one upper case letter', () => {
    const result = passwordValidator.validate('my-password');

    assertValidationResultError(result, 'Password must contain at least one upper case letter');
  });
});

const assertValidationResultError = (result: ValidationResult, error: string) => {
  expect(result).toEqual({
    errors: expect.arrayContaining([error]),
    isValid: false,
  });
};
