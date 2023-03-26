const booleanTokens = ['TRUE', 'FALSE'];
const logicTokens = ['AND', 'OR'];
const negationToken = 'NOT';

enum TokenType {
  Boolean = 'Boolean',
  // AND, OR
  Logic = 'Logic',
  Negation = 'Not',
  Unknown = 'Unknown',
}

interface Context {
  shouldNegate: boolean;
  state:
    | boolean
    // Beginning state
    | undefined;
  logic: 'AND' | 'OR' | undefined;
}

type Action = {
  tokenType: TokenType;
  token: string;
};

type TokenHandler = (
  context: Context,
  action: Action,
) => {
  context: Context;
  nextAllowedTokenTypes: TokenType[];
};

const handlers: Record<string, TokenHandler> = {
  [TokenType.Boolean]: (context, action) => {
    const newContext = { ...context };
    let tokenState = action.token === 'TRUE';

    if (newContext.shouldNegate) {
      tokenState = !tokenState;
      newContext.shouldNegate = false;
    }

    if (newContext.state === undefined) {
      newContext.state = tokenState;
    } else if (context.logic === 'AND') {
      newContext.state = newContext.state && tokenState;
    } else {
      newContext.state = newContext.state || tokenState;
    }

    newContext.shouldNegate = false;
    newContext.logic = undefined;

    return {
      context: newContext,
      nextAllowedTokenTypes: [TokenType.Logic],
    };
  },
  [TokenType.Negation]: (context, _action) => {
    const newContext = { ...context };

    newContext.shouldNegate = true;

    return {
      context: newContext,
      nextAllowedTokenTypes: [TokenType.Boolean],
    };
  },
  [TokenType.Logic]: (context, action) => {
    const newContext = { ...context };

    // TODO get rid of type casting?
    newContext.logic = action.token as 'AND' | 'OR';

    return {
      context: newContext,
      nextAllowedTokenTypes: [TokenType.Boolean, TokenType.Negation],
    };
  },
};

export class BooleanCalculator {
  isTruthy(booleanExpression: string) {
    const tokens = booleanExpression.split(' ');

    let nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation];
    let context: Context = {
      shouldNegate: false,
      logic: undefined,
      state: undefined,
    };

    tokens.forEach((token) => {
      const tokenType = getTokenType(token);

      if (!nextAllowedTokenTypes.includes(tokenType)) {
        throw new Error(`Expected a token of type "${nextAllowedTokenTypes.join('" or "')}" but got "${token}"`);
      }

      const handler = handlers[tokenType];
      const action = { tokenType, token };

      ({ nextAllowedTokenTypes, context } = handler(context, action));
    });

    return Boolean(context.state);
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
