import { Logic, TokenType } from '../tokens';
import { TokenHandler } from './tokenHandlers';

export const handleLogicToken: TokenHandler = (context, action) => {
  const newContext = { ...context };
  const nextAllowedTokenTypes = [TokenType.Boolean, TokenType.Negation, TokenType.OpenGroup];

  newContext.logic = action.token as Logic;

  return [newContext, nextAllowedTokenTypes];
};
