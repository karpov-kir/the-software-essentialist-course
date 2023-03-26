import { TokenType } from '../tokens';
import { Context, emptyContext, TokenHandler } from './tokenHandlers';
import { LinkedListNode } from './utils';

export const handleOpenGroupToken: TokenHandler = (_context, _action) => {
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
};
