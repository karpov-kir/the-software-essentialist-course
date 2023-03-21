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

    return {
      errors: [],
      isValid: true,
    };
  }
}
