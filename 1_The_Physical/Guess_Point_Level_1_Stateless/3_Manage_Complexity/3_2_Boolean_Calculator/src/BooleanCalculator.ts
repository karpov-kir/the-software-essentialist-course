import { Action, Context, emptyContext, TokenHandler, tokenHandlers } from './tokenHandlers/tokenHandlers';
import { getTokenIterator } from './tokenIterator';
import { TokenType } from './tokens';
import { getTokenType } from './utils';

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    let nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];
    let context: Context = { ...emptyContext };

    const tokenIterator = getTokenIterator(booleanExpression);

    while (true) {
      const {
        value: { token, position },
        done,
      } = tokenIterator.next();

      try {
        ({ nextAllowedTokenTypes, context } = handleToken(token, context, nextAllowedTokenTypes));
      } catch (unknownError) {
        const error = unknownError as Error;
        throw new Error(`Error at position ${position}: ${error.message}`);
      }

      if (done) {
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
): { context: Context; nextAllowedTokenTypes: TokenType[] } {
  const tokenType = getTokenType(token);

  if (!nextAllowedTokenTypes.includes(tokenType)) {
    throw new Error(`Expected a token of type "${nextAllowedTokenTypes.join('" or "')}" but got "${token}"`);
  }

  const tokenHandler: TokenHandler = tokenHandlers[tokenType];
  const action: Action = { tokenType, token };

  return tokenHandler(context, action);
}
