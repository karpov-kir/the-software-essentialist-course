import { Token } from './../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleLogicToken: TokenHandler = (context, action) => {
  const nextAllowedTokens = [Token.True, Token.False, Token.Not, Token.OpenGroup];
  const newContext = { ...context };

  newContext.logic = action.token as Token.And | Token.Or;

  return [newContext, nextAllowedTokens];
};
