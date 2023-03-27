import { TokenType } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleBooleanToken: TokenHandler = (context, action) => {
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

  return [newContext, nextAllowedTokenTypes];
};
