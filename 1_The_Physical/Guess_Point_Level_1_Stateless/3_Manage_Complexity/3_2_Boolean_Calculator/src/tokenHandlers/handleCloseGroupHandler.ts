import { handleBooleanToken } from './handleBooleanToken';
import { Token } from '../tokens';
import { TokenHandler, Action, Context } from './tokenHandlers';

export const handleCloseGroupToken: TokenHandler = (context, _action) => {
  const nextAllowedTokens = [Token.And, Token.Or, Token.CloseGroup];
  const finalGroupState = Boolean(context.state);

  if (!context.parentContext) {
    throw new Error('Cannot close a group without a parent context');
  }

  return applyGroupFinalStateToParentContext(context.parentContext, finalGroupState, nextAllowedTokens);
};

// Exit from a child context and apply the child group final state to the parent context as a simple boolean handler
const applyGroupFinalStateToParentContext = (
  parentContext: Context,
  finalGroupState: boolean,
  nextAllowedTokens: Token[],
): ReturnType<TokenHandler> => {
  const action: Action = {
    token: finalGroupState ? Token.True : Token.False,
  };

  const [newContext] = handleBooleanToken(parentContext, action);

  return [newContext, nextAllowedTokens];
};
