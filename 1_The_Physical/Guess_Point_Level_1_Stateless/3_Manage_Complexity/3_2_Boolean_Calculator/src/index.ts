const booleanTokens = ['TRUE', 'FALSE'];
const logicTokens = ['AND', 'OR'];
const negationToken = 'NOT';
const openGroupToken = '(';
const closeGroupToken = ')';

class LinkedListNode<T> {
  next: LinkedListNode<T> | undefined;
  previous: LinkedListNode<T> | undefined;

  constructor(public value: T) {}
}

enum TokenType {
  Boolean = 'Boolean',
  // AND, OR
  Logic = 'Logic',
  Negation = 'Not',
  OpenGroup = 'OpenGroup',
  CloseGroup = 'CloseGroup',
  Unknown = 'Unknown',
}

interface Context {
  shouldNegate: boolean;
  state:
    | boolean
    // Beginning state
    | undefined;
  logic: 'AND' | 'OR' | undefined;
  currentGroup: LinkedListNode<Context> | undefined;
}

const emptyContext: Context = {
  shouldNegate: false,
  logic: undefined,
  state: undefined,
  currentGroup: undefined,
};

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

interface TokenIteratorValue {
  token: string;
  position: number;
}

const handlers: Record<string, TokenHandler> = {
  [TokenType.Boolean]: (context, action) => {
    const nextAllowedTokenTypes = [TokenType.Logic, TokenType.CloseGroup];
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
      nextAllowedTokenTypes,
    };
  },
  [TokenType.Negation]: (context, _action) => {
    const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.OpenGroup];
    const newContext = { ...context };

    newContext.shouldNegate = true;

    return {
      context: newContext,
      nextAllowedTokenTypes,
    };
  },
  [TokenType.Logic]: (context, action) => {
    const newContext = { ...context };
    const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];

    // TODO get rid of type casting?
    newContext.logic = action.token as 'AND' | 'OR';

    return {
      context: newContext,
      nextAllowedTokenTypes,
    };
  },
  [TokenType.OpenGroup]: (_context, _action) => {
    const newContext = { ...emptyContext };
    const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];

    const currentGroup = newContext.currentGroup;

    const newGroup = new LinkedListNode<Context>(newContext);

    if (currentGroup) {
      currentGroup.next = newGroup;
    }

    newGroup.previous = currentGroup;
    newContext.currentGroup = newGroup;

    return {
      context: newContext,
      nextAllowedTokenTypes,
    };
  },
  [TokenType.CloseGroup]: (context, _action) => {
    const groupState = context.state;
    const nextAllowedTokenTypes = [TokenType.Logic, TokenType.CloseGroup];

    // A root group (no parent group) e.g. one from "(TRUE AND FALSE) AND (FALSE OR TRUE)"
    if (!context.currentGroup?.previous) {
      const newContext = { ...context };

      newContext.currentGroup = undefined;
      newContext.state = groupState;

      return {
        context: newContext,
        nextAllowedTokenTypes,
      };
    }

    // Exit from a child context and apply the child group state to the parent context as a simple boolean handler
    const parentContext = context.currentGroup.previous.value;
    const { context: newContext } = handlers[TokenType.Boolean](parentContext, {
      tokenType: TokenType.Boolean,
      token: groupState ? 'TRUE' : 'FALSE',
    });

    return {
      context: newContext,
      nextAllowedTokenTypes,
    };
  },
};

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

function getTokenIterator(booleanExpression: string): Iterator<TokenIteratorValue> {
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
        const isTokenComplete = isSpace || isEnd || isCurrentGroupToken || isNextGroupToken;

        if (!isSpace) {
          currentToken += character;
        }

        if (isTokenComplete) {
          if (isCurrentGroupToken || isNextGroupToken) {
            position++;
          }

          position += geSpaceCountStartingFrom(position);
          const newIsEnd = position === l - 1;

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

function handleToken(
  token: string,
  context: Context,
  nextAllowedTokenTypes: TokenType[],
): { context: Context; nextAllowedTokenTypes: TokenType[] } {
  const tokenType = getTokenType(token);

  if (!nextAllowedTokenTypes.includes(tokenType)) {
    throw new Error(`Expected a token of type "${nextAllowedTokenTypes.join('" or "')}" but got "${token}"`);
  }

  const handler: TokenHandler = handlers[tokenType];
  const action: Action = { tokenType, token };

  return handler(context, action);
}

function isGroupToken(token: string): boolean {
  return token === openGroupToken || token === closeGroupToken;
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

  if (token === openGroupToken) {
    return TokenType.OpenGroup;
  }

  if (token === closeGroupToken) {
    return TokenType.CloseGroup;
  }

  return TokenType.Unknown;
}
