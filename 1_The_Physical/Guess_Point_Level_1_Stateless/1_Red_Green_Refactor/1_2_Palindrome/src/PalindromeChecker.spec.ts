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
});
