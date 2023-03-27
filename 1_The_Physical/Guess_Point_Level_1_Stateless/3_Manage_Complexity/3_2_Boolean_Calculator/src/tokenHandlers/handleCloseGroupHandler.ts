import { handleBooleanToken } from './handleBooleanToken';
import { TokenType } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleCloseGroupToken: TokenHandler = (context, _action) => {
  const groupState = context.state;
  const nextAllowedTokenTypes = [TokenType.Logic, TokenType.CloseGroup];

  if (!context.parentContext) {
    throw new Error('Cannot close a group without a parent context');
  }

  // Exit from a child context and apply the child group state to the parent context as a simple boolean handler
  const [newContext] = handleBooleanToken(context.parentContext, {
    tokenType: TokenType.Boolean,
    token: groupState ? 'TRUE' : 'FALSE',
  });

  return [newContext, nextAllowedTokenTypes];
};
