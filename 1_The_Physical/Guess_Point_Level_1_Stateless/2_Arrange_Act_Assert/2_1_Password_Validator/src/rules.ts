export type ValidationRule = [check: (password: string) => boolean, error: string];

export const applyRules = (password: string, rules: ValidationRule[]) => {
  const errors: string[] = [];

  rules.forEach(([check, error]) => {
    if (check(password)) {
      return;
    }

    errors.push(error);
  });

  return errors;
};

export const atLeast5Characters = (password: string) => password.length >= 5;
export const noMoreThat15Characters = (password: string) => password.length <= 15;
export const atLeastOneUpperCaseLetter = (password: string) => /[A-Z]/.test(password);
export const atLeastOneDigit = (password: string) => /[0-9]/.test(password);
