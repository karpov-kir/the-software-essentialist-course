/**
 * Discrete requirements:
 * - Tells if a word is a palindrome
 * - Tells if a phrase is a palindrome
 * - Case insensitive
 */
export class PalindromeChecker {
  isPalindrome(value: string) {
    return value === value.split('').reverse().join('');
  }
}
