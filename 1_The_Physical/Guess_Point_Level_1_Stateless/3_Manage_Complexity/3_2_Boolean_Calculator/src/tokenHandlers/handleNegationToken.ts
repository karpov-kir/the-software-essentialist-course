import { TokenType } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleNegationToken: TokenHandler = (context, _action) => {
  const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.OpenGroup];
  const newContext = { ...context };

  newContext.shouldNegate = true;

  return {
    context: newContext,
    nextAllowedTokenTypes,
  };
};
