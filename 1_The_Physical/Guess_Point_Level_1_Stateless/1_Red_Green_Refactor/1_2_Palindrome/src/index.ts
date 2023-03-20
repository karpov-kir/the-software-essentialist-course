/**
 * Discrete requirements:
 * - Tells if a word is a palindrome
 * - Tells if a phrase is a palindrome
 * - Case insensitive
 * - Space insensitive
 */
export class PalindromeChecker {
  isPalindrome(value: string) {
    return (
      value.replace(/ /g, '').toLocaleLowerCase() ===
      value.replace(/ /g, '').toLocaleLowerCase().split('').reverse().join('')
    );
  }
}
