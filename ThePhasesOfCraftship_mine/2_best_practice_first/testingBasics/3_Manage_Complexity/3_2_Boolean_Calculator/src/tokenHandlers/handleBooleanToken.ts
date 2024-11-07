import { Token } from '../tokens';
import { Action, Context, TokenHandler } from './tokenHandlers';

export const handleBooleanToken: TokenHandler = (context, action) => {
  const nextAllowedTokens = [Token.And, Token.Or, Token.CloseGroup];
  const tokenState = computeTokenState(context, action);
  const nextState = computeNextState(tokenState, context.logic, context.state);
  const newContext = { ...context };

  newContext.shouldNegate = false;
  newContext.logic = undefined;
  newContext.state = nextState;

  return [newContext, nextAllowedTokens];
};

function computeTokenState(context: Context, action: Action) {
  const tokenState = action.token === Token.True;

  if (context.shouldNegate) {
    return !tokenState;
  }

  return tokenState;
}

function computeNextState(tokenState: boolean, logic?: Token.And | Token.Or, state?: boolean) {
  if (state === undefined) {
    return tokenState;
  }

  if (logic === Token.And) {
    return state && tokenState;
  }

  return state || tokenState;
}
