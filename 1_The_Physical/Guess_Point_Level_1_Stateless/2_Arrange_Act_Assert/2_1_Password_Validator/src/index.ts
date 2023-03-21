export interface ValidationResult {
  errors: string[];
  isValid: boolean;
}

export class PasswordValidator {
  validate(password: string): ValidationResult {
    const errors: string[] = [];

    if (password.length < 5) {
      errors.push('Password is too short');
    }

    if (password.length > 15) {
      errors.push('Password is too long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one upper case letter');
    }

    return {
      errors,
      isValid: !errors.length,
    };
  }
}
