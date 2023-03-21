import { PasswordValidator } from './index';

const passwordValidator = new PasswordValidator();

describe('password validator', () => {
  it('rejects a too short password', () => {
    const result = passwordValidator.validate('1');

    expect(result).toEqual({
      errors: ['Password is too short'],
      isValid: false,
    });
  });

  it('rejects a too long password', () => {
    const result = passwordValidator.validate('1'.repeat(16));

    expect(result).toEqual({
      errors: ['Password is too long'],
      isValid: false,
    });
  });

  it('rejects a password that does not contain at least one upper case letter', () => {
    const result = passwordValidator.validate('my-password');

    expect(result).toEqual({
      errors: ['Password must contain at least one upper case letter'],
      isValid: false,
    });
  });
});
