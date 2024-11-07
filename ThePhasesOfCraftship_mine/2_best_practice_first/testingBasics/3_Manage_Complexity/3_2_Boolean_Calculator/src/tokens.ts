export enum Token {
  True = 'TRUE',
  False = 'FALSE',
  And = 'AND',
  Or = 'OR',
  Not = 'NOT',
  OpenGroup = '(',
  CloseGroup = ')',
}

function normalizeRawToken(rawToken: string): string {
  return rawToken.toUpperCase();
}

export function convertToken(rawToken: string): Token {
  const normalizedRawToken = normalizeRawToken(rawToken);

  if (!(Object.values(Token) as string[]).includes(normalizedRawToken)) {
    throw new Error(`Unknown token "${rawToken}"`);
  }

  return normalizedRawToken as Token;
}

export function isGroupToken(rawToken: string): boolean {
  const normalizedRawToken = normalizeRawToken(rawToken);

  return normalizedRawToken === Token.OpenGroup || normalizedRawToken === Token.CloseGroup;
}

export function isBooleanToken(rawToken: string): boolean {
  const normalizedRawToken = normalizeRawToken(rawToken);

  return normalizedRawToken === Token.True || normalizedRawToken === Token.False;
}
