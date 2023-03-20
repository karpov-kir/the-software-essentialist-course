import { PalindromeChecker } from './PalindromeChecker';

const palindromeChecker = new PalindromeChecker();

describe(PalindromeChecker, () => {
  it('tells that a word is a palindrome such as "mom"', () => {
    expect(palindromeChecker.isPalindrome('mom')).toBe(true);
  });

  it('tells that a word is not a palindrome such as "bills"', () => {
    expect(palindromeChecker.isPalindrome('bills')).toBe(false);
  });

  it('tells that a capitalized word is a palindrome such as "Mom"', () => {
    expect(palindromeChecker.isPalindrome('Mom')).toBe(true);
  });

  it('tells that a phrase is a palindrome such as "Was It A Rat I Saw"', () => {
    expect(palindromeChecker.isPalindrome('Was It A Rat I Saw')).toBe(true);
  });

  it('tells that a phrase is not a palindrome such as "I am not a palindrome"', () => {
    expect(palindromeChecker.isPalindrome('I am not a palindrome')).toBe(false);
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
