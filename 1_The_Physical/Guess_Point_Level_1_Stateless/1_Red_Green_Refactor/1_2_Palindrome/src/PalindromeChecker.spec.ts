import { PalindromeChecker } from './PalindromeChecker';

const palindromeChecker = new PalindromeChecker();

describe(PalindromeChecker, () => {
  it('tells that "mom" is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('mom')).toBe(true);
  });

  it('tells that "bills" is not a palindrome', () => {
    expect(palindromeChecker.isPalindrome('bills')).toBe(false);
  });

  it('tells that "Mom" is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('Mom')).toBe(true);
  });

  it('tells that "Was It A Rat I Saw" is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('Was It A Rat I Saw')).toBe(true);
  });

  it('tells that an empty string is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('')).toBe(true);
  });

  it('tells that a phrase with many spaces is a palindrome such as "Ne   ver Odd or Ev   en"', () => {
    expect(palindromeChecker.isPalindrome('Ne   ver Odd or Ev   en')).toBe(true);
  });

  it('tells a word that starts with many spaces is a palindrome such as "  mom"', () => {
    expect(palindromeChecker.isPalindrome('  mom')).toBe(true);
  });

  it('tells a word that ends with many spaces is a palindrome such as "mom   "', () => {
    expect(palindromeChecker.isPalindrome('mom   ')).toBe(true);
  });
});
