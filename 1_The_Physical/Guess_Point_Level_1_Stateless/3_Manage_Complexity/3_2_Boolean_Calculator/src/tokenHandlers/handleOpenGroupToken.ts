import { TokenType } from '../tokens';
import { emptyContext, TokenHandler } from './tokenHandlers';

export const handleOpenGroupToken: TokenHandler = (context, _action) => {
  const newContext = { ...emptyContext };
  const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];

  newContext.parentContext = context;

  return [newContext, nextAllowedTokenTypes];
};
