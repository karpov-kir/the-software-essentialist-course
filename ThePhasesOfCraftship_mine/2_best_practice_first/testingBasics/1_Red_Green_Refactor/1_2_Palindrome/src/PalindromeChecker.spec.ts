import { describe, expect, it } from 'vitest';

import { PalindromeChecker } from './PalindromeChecker';

const palindromeChecker = new PalindromeChecker();

describe(PalindromeChecker, () => {
  it('tells that a word is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('mom')).toBe(true);
  });

  it('tells that a word is not a palindrome', () => {
    expect(palindromeChecker.isPalindrome('bills')).toBe(false);
  });

  it('tells that a capitalized word is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('Mom')).toBe(true);
  });

  it('tells that a phrase is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('Was It A Rat I Saw')).toBe(true);
  });

  it('tells that a phrase is not a palindrome', () => {
    expect(palindromeChecker.isPalindrome('I am not a palindrome')).toBe(false);
  });

  it('tells that an empty string is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('')).toBe(true);
  });

  it('tells that a phrase with many spaces is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('Ne   ver Odd or Ev   en')).toBe(true);
  });

  it('tells that a word that starts with many spaces is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('  mom')).toBe(true);
  });

  it('tells that a word that ends with many spaces is a palindrome', () => {
    expect(palindromeChecker.isPalindrome('mom   ')).toBe(true);
  });
});
