import { Token } from './../tokens';
import { emptyContext, TokenHandler } from './tokenHandlers';

export const handleOpenGroupToken: TokenHandler = (context, _action) => {
  const nextAllowedTokens = [Token.True, Token.False, Token.Not, Token.OpenGroup];
  const newContext = { ...emptyContext };

  newContext.parentContext = context;

  return [newContext, nextAllowedTokens];
};
