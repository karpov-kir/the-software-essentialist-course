import { Token } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleNegationToken: TokenHandler = (context, _action) => {
  const nextAllowedTokens = [Token.True, Token.False, Token.OpenGroup];
  const newContext = { ...context };

  newContext.shouldNegate = true;

  return [newContext, nextAllowedTokens];
};
