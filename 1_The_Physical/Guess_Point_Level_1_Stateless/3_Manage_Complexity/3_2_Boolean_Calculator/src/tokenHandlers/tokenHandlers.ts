import { TokenType, Logic } from '../tokens';
import { handleBooleanToken } from './handleBooleanToken';
import { handleCloseGroupToken } from './handleCloseGroupHandler';
import { handleLogicToken } from './handleLogicToken';
import { handleNegationToken } from './handleNegationToken';
import { handleOpenGroupToken } from './handleOpenGroupToken';
import { LinkedListNode } from './utils';

export interface Context {
  shouldNegate: boolean;
  state:
    | boolean
    // Beginning state
    | undefined;
  logic: Logic | undefined;
  currentGroup: LinkedListNode<Context> | undefined;
}

export const emptyContext: Context = {
  shouldNegate: false,
  logic: undefined,
  state: undefined,
  currentGroup: undefined,
};

export type Action = {
  tokenType: TokenType;
  token: string;
};

export type TokenHandler = (
  context: Context,
  action: Action,
) => {
  context: Context;
  nextAllowedTokenTypes: TokenType[];
};

export const tokenHandlers: Record<string, TokenHandler> = {
  [TokenType.Boolean]: handleBooleanToken,
  [TokenType.Negation]: handleNegationToken,
  [TokenType.Logic]: handleLogicToken,
  [TokenType.OpenGroup]: handleOpenGroupToken,
  [TokenType.CloseGroup]: handleCloseGroupToken,
};
