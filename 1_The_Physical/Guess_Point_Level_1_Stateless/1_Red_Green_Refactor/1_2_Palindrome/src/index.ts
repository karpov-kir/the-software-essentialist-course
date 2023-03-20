export class PalindromeChecker {
  isPalindrome(value: string) {
    return value === value.split('').reverse().join();
  }
}
