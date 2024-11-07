import { Token } from '../tokens';
import { handleBooleanToken } from './handleBooleanToken';
import { handleCloseGroupToken } from './handleCloseGroupHandler';
import { handleLogicToken } from './handleLogicToken';
import { handleNegationToken } from './handleNegationToken';
import { handleOpenGroupToken } from './handleOpenGroupToken';

export interface Context {
  shouldNegate: boolean;
  state?: boolean;
  logic?: Token.And | Token.Or;
  parentContext?: Context;
}

export const emptyContext: Context = {
  shouldNegate: false,
  logic: undefined,
  state: undefined,
  parentContext: undefined,
};

export type Action = {
  token: Token;
};

export type TokenHandler = (context: Context, action: Action) => [context: Context, nextAllowedTokens: Token[]];

export const tokenHandlers: Record<string, TokenHandler> = {
  [Token.True]: handleBooleanToken,
  [Token.False]: handleBooleanToken,
  [Token.Not]: handleNegationToken,
  [Token.Or]: handleLogicToken,
  [Token.And]: handleLogicToken,
  [Token.OpenGroup]: handleOpenGroupToken,
  [Token.CloseGroup]: handleCloseGroupToken,
};
