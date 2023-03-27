import { Action, Context, emptyContext, TokenHandler, tokenHandlers } from './tokenHandlers/tokenHandlers';
import { getTokenIterator } from './tokenIterator';
import { TokenType } from './tokens';
import { getTokenType } from './utils';

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    let nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];
    let context: Context = { ...emptyContext };

    const tokenIterator = getTokenIterator(booleanExpression);
    let openGroupCount = 0;
    let closeGroupCount = 0;

    while (true) {
      const {
        value: { token, startPosition, endPosition },
        done,
      } = tokenIterator.next();

      const tokenType = getTokenType(token);

      if (tokenType === TokenType.OpenGroup) {
        openGroupCount++;
      } else if (tokenType === TokenType.CloseGroup) {
        closeGroupCount++;
      }

      try {
        [context, nextAllowedTokenTypes] = handleToken(token, context, nextAllowedTokenTypes);
      } catch (unknownError) {
        const error = unknownError as Error;
        throw new Error(`Error at position ${startPosition}-${endPosition}: ${error.message}`);
      }

      if (done) {
        if (openGroupCount !== closeGroupCount) {
          throw new Error('Unbalanced parenthesis');
        }

        break;
      }
    }

    return Boolean(context.state);
  }
}

function handleToken(
  token: string,
  context: Context,
  nextAllowedTokenTypes: TokenType[],
): [context: Context, nextAllowedTokenTypes: TokenType[]] {
  const tokenType = getTokenType(token);

  if (!nextAllowedTokenTypes.includes(tokenType)) {
    throw new Error(`Expected a token of type "${nextAllowedTokenTypes.join('" or "')}" but got "${token}"`);
  }

  const tokenHandler: TokenHandler = tokenHandlers[tokenType];
  const action: Action = { tokenType, token };

  return tokenHandler(context, action);
}
