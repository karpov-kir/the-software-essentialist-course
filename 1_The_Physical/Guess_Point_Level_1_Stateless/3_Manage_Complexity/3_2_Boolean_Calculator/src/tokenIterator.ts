import { isGroupToken } from './utils';

interface TokenIteratorValue {
  token: string;
  position: number;
}

export function getTokenIterator(booleanExpression: string): Iterator<TokenIteratorValue> {
  if (!booleanExpression) {
    throw new Error('Boolean expression must not be empty');
  }

  let position = 0;

  const geSpaceCountStartingFrom = (startPosition: number) => {
    let count = 0;

    for (let l = booleanExpression.length; startPosition < l; startPosition++) {
      const character = booleanExpression[startPosition];

      if (/\s/.test(character)) {
        count++;
      } else {
        break;
      }
    }

    return count;
  };

  return {
    next() {
      let currentToken = '';

      for (let l = booleanExpression.length; position < l; position++) {
        const character = booleanExpression[position];
        const isSpace = /\s/.test(character);
        const isEnd = position === l - 1;
        const isCurrentGroupToken = isGroupToken(character);
        const isNextGroupToken = isGroupToken(booleanExpression[position + 1]);
        const maybeTokenBoundary = isSpace || isEnd || isCurrentGroupToken || isNextGroupToken;

        if (!isSpace) {
          currentToken += character;
        }

        if (maybeTokenBoundary && currentToken) {
          if (isCurrentGroupToken || isNextGroupToken) {
            position++;
          }

          const spacesAfterToken = geSpaceCountStartingFrom(position);
          position += spacesAfterToken;
          const newIsEnd = position >= l - 1;

          return {
            value: {
              token: currentToken,
              position,
            },
            done: newIsEnd,
          };
        }
      }

      throw new Error('Iterator has already been finished');
    },
  };
}
