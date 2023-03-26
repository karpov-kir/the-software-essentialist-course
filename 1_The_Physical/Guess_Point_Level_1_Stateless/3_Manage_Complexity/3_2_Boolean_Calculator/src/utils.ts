import { booleanTokens, closeGroupToken, logicTokens, negationToken, openGroupToken, TokenType } from './tokens';

export function isGroupToken(token: string): boolean {
  return token === openGroupToken || token === closeGroupToken;
}

export function getTokenType(token: string): TokenType {
  if (booleanTokens.includes(token)) {
    return TokenType.Boolean;
  }

  if (logicTokens.includes(token)) {
    return TokenType.Logic;
  }

  if (token === negationToken) {
    return TokenType.Negation;
  }

  if (token === openGroupToken) {
    return TokenType.OpenGroup;
  }

  if (token === closeGroupToken) {
    return TokenType.CloseGroup;
  }

  return TokenType.Unknown;
}
