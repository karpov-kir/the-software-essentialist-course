import { PalindromeChecker } from './';

const palindromeChecker = new PalindromeChecker();

describe(PalindromeChecker, () => {
  it('tells that "mom" is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('mom')).toBe(true);
  });

  it('tells that "bills" is not a palindrome', () => {
    expect(palindromeChecker.isPalindrome('bills')).toBe(false);
  });
});
