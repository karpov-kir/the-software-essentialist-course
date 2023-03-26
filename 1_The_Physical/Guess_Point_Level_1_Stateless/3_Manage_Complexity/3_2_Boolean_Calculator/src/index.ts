const booleanTokens = ['TRUE', 'FALSE'];
const logicTokens = ['AND', 'OR'];
const negationToken = 'NOT';

enum TokenType {
  Boolean = 'Boolean',
  Logic = 'Logic',
  Negation = 'Not',
  Unknown = 'Unknown',
}

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    const tokens = booleanExpression.split(' ');

    let nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation];
    let state: boolean | undefined;
    let logic: string | undefined;
    let isNegated = false;

    tokens.forEach((token) => {
      const tokenType = getTokenType(token);

      if (!nextAllowedTokenTypes.includes(tokenType)) {
        throw new Error(`Expected a token of type "${nextAllowedTokenTypes.join('" or "')}" but got "${token}"`);
      }

      if (shouldHandleNext(nextAllowedTokenTypes, [TokenType.Boolean, TokenType.Negation])) {
        if (tokenType === TokenType.Boolean) {
          let tokenState = token === 'TRUE';

          if (isNegated) {
            tokenState = !tokenState;
            isNegated = false;
          }

          if (state === undefined) {
            state = tokenState;
          } else if (logic === 'AND') {
            state = state && tokenState;
          } else {
            state = state || tokenState;
          }

          nextAllowedTokenTypes = [TokenType.Logic];
        } else {
          nextAllowedTokenTypes = [TokenType.Boolean];
          isNegated = true;
        }
      } else if (shouldHandleNext(nextAllowedTokenTypes, [TokenType.Boolean])) {
        let tokenState = token === 'TRUE';

        if (isNegated) {
          tokenState = !tokenState;
          isNegated = false;
        }

        if (state === undefined) {
          state = tokenState;
        } else if (logic === 'AND') {
          state = state && tokenState;
        } else {
          state = state || tokenState;
        }

        nextAllowedTokenTypes = [TokenType.Logic];
      } else if (shouldHandleNext(nextAllowedTokenTypes, [TokenType.Logic])) {
        logic = token;
        nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation];
      }
    });

    return state;
  }
}

function getTokenType(token: string): TokenType {
  if (booleanTokens.includes(token)) {
    return TokenType.Boolean;
  }

  if (logicTokens.includes(token)) {
    return TokenType.Logic;
  }

  if (token === negationToken) {
    return TokenType.Negation;
  }

  return TokenType.Unknown;
}

function shouldHandleNext(nextAllowedTokenTypes: TokenType[], handlerOf: TokenType[]) {
  if (handlerOf.length !== nextAllowedTokenTypes.length) {
    return;
  }

  for (let i = 0; i < handlerOf.length; i++) {
    const handlerToken = handlerOf[i];

    if (!nextAllowedTokenTypes.includes(handlerToken)) {
      return false;
    }
  }

  return true;
}
