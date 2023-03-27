import { Token } from './../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleBooleanToken: TokenHandler = (context, action) => {
  const nextAllowedTokens = [Token.And, Token.Or, Token.CloseGroup];
  const newContext = { ...context };
  let tokenState = action.token === Token.True;

  if (newContext.shouldNegate) {
    tokenState = !tokenState;
    newContext.shouldNegate = false;
  }

  if (newContext.state === undefined) {
    newContext.state = tokenState;
  } else if (context.logic === Token.And) {
    newContext.state = newContext.state && tokenState;
  } else {
    newContext.state = newContext.state || tokenState;
  }

  newContext.shouldNegate = false;
  newContext.logic = undefined;

  return [newContext, nextAllowedTokens];
};
