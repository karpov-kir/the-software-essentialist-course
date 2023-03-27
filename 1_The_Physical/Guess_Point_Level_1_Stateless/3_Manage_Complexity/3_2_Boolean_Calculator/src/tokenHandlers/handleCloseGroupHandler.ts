import { handleBooleanToken } from './handleBooleanToken';
import { Token } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleCloseGroupToken: TokenHandler = (context, _action) => {
  const nextAllowedTokens = [Token.And, Token.Or, Token.CloseGroup];
  const groupState = context.state;

  if (!context.parentContext) {
    throw new Error('Cannot close a group without a parent context');
  }

  // Exit from a child context and apply the child group state to the parent context as a simple boolean handler
  const [newContext] = handleBooleanToken(context.parentContext, {
    token: groupState ? Token.True : Token.False,
  });

  return [newContext, nextAllowedTokens];
};
