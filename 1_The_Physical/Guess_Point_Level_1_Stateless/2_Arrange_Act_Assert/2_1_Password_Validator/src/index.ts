interface ValidationResult {
  errors: string[];
  isValid: boolean;
}

export class PasswordValidator {
  validate(password: string): ValidationResult {
    if (password.length < 5) {
      return {
        errors: ['Password is too short'],
        isValid: false,
      };
    }

    if (password.length > 15) {
      return {
        errors: ['Password is too long'],
        isValid: false,
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        errors: ['Password must contain at least one upper case letter'],
        isValid: false,
      };
    }

    return {
      errors: [],
      isValid: true,
    };
  }
}
