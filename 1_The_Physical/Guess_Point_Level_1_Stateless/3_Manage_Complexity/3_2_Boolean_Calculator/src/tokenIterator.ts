import { isGroupToken } from './utils';

interface TokenIteratorValue {
  token: string;
  startPosition: number;
  endPosition: number;
}

export function getTokenIterator(booleanExpression: string): Iterator<TokenIteratorValue> {
  if (!booleanExpression) {
    throw new Error('Boolean expression must not be empty');
  }

  const geSpaceCountStartingFrom = (position: number) => {
    let spaceCount = 0;

    for (let l = booleanExpression.length; position < l; position++) {
      const character = booleanExpression[position];

      if (/\s/.test(character)) {
        spaceCount++;
      } else {
        break;
      }
    }

    return spaceCount;
  };

  let nextStartPosition = 0;

  return {
    next() {
      const startPosition = nextStartPosition;

      let currentToken = '';
      let position = startPosition;

      for (let characterCount = booleanExpression.length; position < characterCount; position++) {
        const character = booleanExpression[position];
        const isSpace = /\s/.test(character);
        const isEnd = position === characterCount - 1;
        const isCurrentGroupToken = isGroupToken(character);
        const isNextGroupToken = isGroupToken(booleanExpression[position + 1]);
        const maybeTokenBoundary = isSpace || isEnd || isCurrentGroupToken || isNextGroupToken;

        if (!isSpace) {
          currentToken += character;
        }

        const isTokenBoundary = currentToken && maybeTokenBoundary;

        if (isTokenBoundary) {
          const tokenEndPosition = isSpace ? position - 1 : position;
          const spacesAfterToken = geSpaceCountStartingFrom(isSpace ? position : position + 1);
          const positionAfterSpaces = tokenEndPosition + spacesAfterToken;
          const recalculatedIsEnd = positionAfterSpaces >= characterCount - 1;
          const nextTokenStartPosition = tokenEndPosition + spacesAfterToken + 1;

          nextStartPosition = nextTokenStartPosition;

          return {
            value: {
              token: currentToken,
              startPosition,
              endPosition: tokenEndPosition,
            },
            done: recalculatedIsEnd,
          };
        }
      }

      throw new Error('Iterator has already been finished');
    },
  };
}
