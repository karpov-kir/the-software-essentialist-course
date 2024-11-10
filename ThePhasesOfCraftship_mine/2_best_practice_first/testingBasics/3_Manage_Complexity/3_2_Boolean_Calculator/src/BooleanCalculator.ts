import { Action, Context, emptyContext, TokenHandler, tokenHandlers } from './tokenHandlers/tokenHandlers';
import { getTokenIterator } from './tokenIterator';
import { convertToken, Token } from './tokens';

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    let nextAllowedTokens = [Token.True, Token.False, Token.Not, Token.OpenGroup];
    let context: Context = { ...emptyContext };

    const tokenIterator = getTokenIterator(booleanExpression);

    let openGroupCount = 0;
    let closeGroupCount = 0;

    while (true) {
      const {
        value: { rawToken, startPosition, endPosition },
        done,
      } = tokenIterator.next();

      try {
        const token = convertToken(rawToken);

        if (token === Token.OpenGroup) {
          openGroupCount++;
        } else if (token === Token.CloseGroup) {
          closeGroupCount++;
        }

        [context, nextAllowedTokens] = handleToken(token, context, nextAllowedTokens);
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
  token: Token,
  context: Context,
  nextAllowedTokens: Token[],
): [context: Context, nextAllowedTokens: Token[]] {
  if (!nextAllowedTokens.includes(token)) {
    throw new Error(`Expected "${nextAllowedTokens.join('" or "')}" but got "${token}"`);
  }

  const tokenHandler: TokenHandler = tokenHandlers[token];
  const action: Action = { token };

  return tokenHandler(context, action);
}
