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
});
