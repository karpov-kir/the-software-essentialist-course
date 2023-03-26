import { handleBooleanToken } from './handleBooleanToken';
import { TokenType } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleCloseGroupToken: TokenHandler = (context, _action) => {
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
  const { context: newContext } = handleBooleanToken(parentContext, {
    tokenType: TokenType.Boolean,
    token: groupState ? 'TRUE' : 'FALSE',
  });

  return {
    context: newContext,
    nextAllowedTokenTypes,
  };
};
