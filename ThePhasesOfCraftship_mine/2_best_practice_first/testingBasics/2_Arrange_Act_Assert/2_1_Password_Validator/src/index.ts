import {
  applyRules,
  atLeast5Characters,
  atLeastOneDigit,
  atLeastOneUpperCaseLetter,
  noMoreThat15Characters,
  ValidationRule,
} from './rules';

export interface ValidationResult {
  errors: string[];
  isValid: boolean;
}

export class PasswordValidator {
  private static rules: ValidationRule[] = [
    [atLeast5Characters, 'Password is too short'],
    [noMoreThat15Characters, 'Password is too long'],
    [atLeastOneUpperCaseLetter, 'Password must contain at least one upper case letter'],
    [atLeastOneDigit, 'Password must contain at least one digit'],
  ];

  validate(password: string): ValidationResult {
    const errors = applyRules(password, PasswordValidator.rules);

    return {
      errors,
      isValid: !errors.length,
    };
  }
}
