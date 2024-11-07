import { createStringIterator, StringIteratorValue } from './stringIterator';

/**
 * Discrete requirements:
 * - Tells if a word is a palindrome
 * - Tells if a phrase is a palindrome
 * - Case insensitive
 * - Space insensitive
 * - Rather strict complexity O(N)
 */
export class PalindromeChecker {
  isPalindrome(value: string) {
    if (!value) {
      return true;
    }

    const leftIterator = createStringIterator(value);
    const rightIterator = createStringIterator(value, { reverse: true });

    while (true) {
      const left = getNextValidStringIteratorValue(leftIterator);
      const right = getNextValidStringIteratorValue(rightIterator);

      if (!left || !right || right.position <= left.position) {
        break;
      }

      if (left.character !== right.character) {
        return false;
      }
    }

    return true;
  }
}

const getNextValidStringIteratorValue = (
  stringIterator: Iterator<StringIteratorValue>,
): StringIteratorValue | undefined => {
  while (true) {
    const { value, done } = stringIterator.next();
    let sanitizedCharacter = value.character.toLowerCase();

    if (sanitizedCharacter === ' ') {
      sanitizedCharacter = '';
    }

    if (sanitizedCharacter) {
      return {
        character: sanitizedCharacter,
        position: value.position,
      };
    }

    if (done) {
      break;
    }
  }

  return undefined;
};
